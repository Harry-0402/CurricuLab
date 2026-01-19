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

    async getAttendanceStats(): Promise<SubjectAttendanceStats[]> {
        const logs = await this.getAttendanceLogs();
        const subjects = await getSubjects();

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

    // Optimized method to fetch all dashboard data in parallel/batched to reduce network requests
    async getDashboardData(daysToCheckMissing = 5) {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        // Fetch logs and subjects in parallel
        const [logs, subjects] = await Promise.all([
            this.getAttendanceLogs(),
            getSubjects()
        ]);

        // Calculate Stats
        const statsMap = new Map<string, { total: number, present: number, name: string }>();
        subjects.forEach(s => {
            statsMap.set(s.id, { total: 0, present: 0, name: s.title });
        });

        const validLogs = logs.filter(l => l.status !== 'Canceled');
        validLogs.forEach(log => {
            const current = statsMap.get(log.subjectId) || { total: 0, present: 0, name: log.subjectName || 'Unknown' };
            current.total++;
            if (log.status === 'Present') {
                current.present++;
            }
            statsMap.set(log.subjectId, current);
        });

        const stats = Array.from(statsMap.entries()).map(([id, stat]) => ({
            subjectId: id,
            subjectName: stat.name,
            totalClasses: stat.total,
            presentClasses: stat.present,
            percentage: stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0
        }));

        // Calculate Missing Records
        // Use the ALREADY FETCHED logs and subjects
        const today = new Date();
        const timetable = await getTimetable(); // This might still fetch, but it's separate. Could pass in if needed. 
        // Assuming getTimetable is fast or also cached.

        const missingRecords: { date: string, subjectId: string, subjectName: string, dayName: string }[] = [];

        for (let i = 1; i <= daysToCheckMissing; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            const scheduledClasses = timetable.filter(t => t.day === dayName);

            for (const cls of scheduledClasses) {
                const subject = subjects.find(s => s.code === cls.subjectCode || s.title === cls.subjectTitle);
                if (subject) {
                    const hasLog = logs.some(log =>
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

        return { stats, subjects, missingRecords };
    },

    async getAllLogs(): Promise<AttendanceLog[]> {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('attendance_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (error) throw error;

        return (data || []).map(log => ({
            id: log.id,
            userId: log.user_id,
            subjectId: log.subject_id,
            subjectName: log.subject_name,
            date: log.date,
            status: log.status,
            createdAt: log.created_at
        }));
    },

    async deleteLog(logId: string): Promise<void> {
        const { error } = await supabase
            .from('attendance_logs')
            .delete()
            .eq('id', logId);

        if (error) throw error;
    },

    async bulkDeleteLogs(logIds: string[]): Promise<void> {
        const { error } = await supabase
            .from('attendance_logs')
            .delete()
            .in('id', logIds);

        if (error) throw error;
    }
};
