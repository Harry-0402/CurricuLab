import { supabase } from "@/utils/supabase/client";
import { ChangelogService } from "./changelog.service";
import { AuthService } from "./auth.service";
import { getTimetable } from "./timetable-service";
import { getSubjects } from "./app.service";
import { Subject } from "@/types";

export interface AttendanceLog {
    id: string;
    userId: string;
    subjectId: string;
    subjectName: string;
    date: string;
    status: 'Present' | 'Absent' | 'Canceled';
    createdAt: string;
}

export interface SubjectAttendanceStats {
    subjectId: string;
    subjectName: string;
    totalClasses: number;
    presentClasses: number;
    percentage: number;
}

export const AttendanceService = {
    async logAttendance(date: string, subjectId: string, status: 'Present' | 'Absent' | 'Canceled') {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        // Get subject name for denormalization
        const subjects = await getSubjects();
        const subject = subjects.find(s => s.id === subjectId);
        const subjectName = subject ? subject.title : 'Unknown Subject';

        const { data, error } = await supabase
            .from('attendance_logs')
            .upsert({
                user_id: user.id,
                subject_id: subjectId,
                subject_name: subjectName,
                date: date,
                status: status
            }, { onConflict: 'user_id, subject_id, date' })
            .select()
            .single();

        if (error) throw error;

        // Log to system changelog (optional, keeping it lightweight)
        // await ChangelogService.logChange({
        //     entity_type: 'Attendance',
        //     entity_id: data.id,
        //     action: 'CREATE',
        //     changes: { status, date, subject: subjectName }
        // });

        return data;
    },

    async getAttendanceLogs(): Promise<AttendanceLog[]> {
        const user = await AuthService.getCurrentUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('attendance_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (error) {
            console.error('Failed to fetch attendance logs:', error);
            return [];
        }

        return data.map(log => ({
            id: log.id,
            userId: log.user_id,
            subjectId: log.subject_id,
            subjectName: log.subject_name,
            date: log.date,
            status: log.status,
            createdAt: log.created_at
        }));
    },

    async getAttendanceStats(cachedLogs?: AttendanceLog[], cachedSubjects?: Subject[]): Promise<SubjectAttendanceStats[]> {
        const logs = cachedLogs || await this.getAttendanceLogs();
        const subjects = cachedSubjects || await getSubjects();

        // Filter out canceled classes for calculation
        const validLogs = logs.filter(l => l.status !== 'Canceled');

        const statsMap = new Map<string, { total: number, present: number, name: string }>();

        // Initialize with all subjects
        subjects.forEach(s => {
            statsMap.set(s.id, { total: 0, present: 0, name: s.title });
        });

        // Tally logs
        validLogs.forEach(log => {
            const current = statsMap.get(log.subjectId) || { total: 0, present: 0, name: log.subjectName || 'Unknown' };
            current.total++;
            if (log.status === 'Present') {
                current.present++;
            }
            statsMap.set(log.subjectId, current);
        });

        // Convert to array
        return Array.from(statsMap.entries()).map(([id, stat]) => ({
            subjectId: id,
            subjectName: stat.name,
            totalClasses: stat.total,
            presentClasses: stat.present,
            percentage: stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0
        }));
    },

    // Check for missing attendance records based on Timetable for the last N days
    async getMissingRecords(daysToCheck = 5, cachedLogs?: AttendanceLog[], cachedSubjects?: Subject[], cachedTimetable?: any[]) {
        const user = await AuthService.getCurrentUser();
        if (!user) return [];

        const today = new Date();
        const timetable = cachedTimetable || await getTimetable();
        const existingLogs = cachedLogs || await this.getAttendanceLogs();
        const subjects = cachedSubjects || await getSubjects();

        const missingRecords: { date: string, subjectId: string, subjectName: string, dayName: string }[] = [];

        // Check past N days (excluding today because user might mark it later)
        for (let i = 1; i <= daysToCheck; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"

            // Get classes scheduled for this day
            // Note: Timetable day is stored as "Monday", "Tuesday", etc.
            const scheduledClasses = timetable.filter(t => t.day === dayName);

            for (const cls of scheduledClasses) {
                // Find subject ID by matching code or title (Timetable uses code/title, we need ID)
                // Timetable only has code/title. We need to match it to a Subject ID for logging.
                // Assuming matched by code first, then title.
                const subject = subjects.find(s => s.code === cls.subjectCode || s.title === cls.subjectTitle);

                if (subject) {
                    // Check if log exists for this date + subject
                    const hasLog = existingLogs.some(log =>
                        log.date === dateString && log.subjectId === subject.id
                    );

                    if (!hasLog) {
                        missingRecords.push({
                            date: dateString,
                            subjectId: subject.id,
                            subjectName: subject.title,
                            dayName: dayName
                        });
                    }
                }
            }
        }

        return missingRecords;
    }
};
