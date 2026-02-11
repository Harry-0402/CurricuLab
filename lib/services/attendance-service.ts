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

export interface MissingRecord {
    date: Date;
    dayName: string;
    subjectId: string;
    subjectName: string;
}

export const AttendanceService = {
    async logAttendance(date: string, subjectId: string, status: 'Present' | 'Absent' | 'Canceled', verificationImage?: Blob) {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const subjects = await getSubjects();
        const subject = subjects.find(s => s.id === subjectId);
        const subjectName = subject ? subject.title : 'Unknown Subject';

        let verificationImageUrl = null;
        if (verificationImage) {
            const fileName = `${user.id}/${date}_${subjectId}_${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('attendance_proofs')
                .upload(fileName, verificationImage, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (uploadError) {
                console.error('Failed to upload verification image:', uploadError);
                throw new Error('Failed to upload verification proof');
            }

            const { data: { publicUrl } } = supabase.storage
                .from('attendance_proofs')
                .getPublicUrl(fileName);

            verificationImageUrl = publicUrl;
        }

        const { data, error } = await supabase
            .from('attendance_logs')
            .upsert({
                user_id: user.id,
                subject_id: subjectId,
                subject_name: subjectName,
                date: date,
                status: status,
                verification_image_url: verificationImageUrl
            }, { onConflict: 'user_id, subject_id, date' })
            .select()
            .single();

        if (error) throw error;

        await ChangelogService.logChange(
            'Attendance',
            `Marked ${status} for ${date} (${subjectName})`,
            'CREATE'
        );

        return data;
    },

    async markDailyAttendance(date: string, verificationImage: Blob) {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        // 1. Upload Verification Proof once
        const fileName = `${user.id}/${date}_daily_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
            .from('attendance_proofs')
            .upload(fileName, verificationImage, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (uploadError) {
            console.error('Failed to upload daily verification:', uploadError);
            throw new Error('Failed to upload verification proof');
        }

        const { data: { publicUrl } } = supabase.storage
            .from('attendance_proofs')
            .getPublicUrl(fileName);

        // 2. Get Scheduled Subjects for the Day
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const [timetable, subjects] = await Promise.all([
            getTimetable(),
            getSubjects()
        ]);

        const scheduledClasses = timetable.filter(t => t.day === dayName);
        if (scheduledClasses.length === 0) {
            throw new Error(`No classes scheduled for ${dayName}`);
        }

        const subjectsToLog = new Map<string, string>();
        scheduledClasses.forEach(cls => {
            const subject = subjects.find(s => s.code === cls.subjectCode || s.title === cls.subjectTitle);
            if (subject) {
                subjectsToLog.set(subject.id, subject.title);
            }
        });

        if (subjectsToLog.size === 0) {
            throw new Error("Could not match scheduled classes to valid subjects.");
        }

        // 3. Create Bulk Log Data
        const logsToInsert = Array.from(subjectsToLog.entries()).map(([subId, subName]) => ({
            user_id: user.id,
            subject_id: subId,
            subject_name: subName,
            date: date,
            status: 'Present',
            verification_image_url: publicUrl
        }));

        const { error } = await supabase
            .from('attendance_logs')
            .upsert(logsToInsert, { onConflict: 'user_id, subject_id, date' });

        if (error) throw error;

        await ChangelogService.logChange(
            'Attendance',
            `Daily Check-in for ${date}: Marked ${logsToInsert.length} classes Present`,
            'CREATE'
        );
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

    async updateLogStatus(logId: string, newStatus: 'Present' | 'Absent' | 'Canceled'): Promise<void> {
        const { data: currentLog, error: fetchError } = await supabase
            .from('attendance_logs')
            .select('subject_name, date')
            .eq('id', logId)
            .single();

        if (fetchError) throw fetchError;

        const { error } = await supabase
            .from('attendance_logs')
            .update({ status: newStatus })
            .eq('id', logId);

        if (error) throw error;

        await ChangelogService.logChange(
            'Attendance',
            `Updated status to ${newStatus} for ${currentLog.date} (${currentLog.subject_name})`,
            'UPDATE'
        );
    },

    async bulkDeleteLogs(logIds: string[]): Promise<void> {
        const { error } = await supabase
            .from('attendance_logs')
            .delete()
            .in('id', logIds);

        if (error) throw error;
    },

    async getAttendanceLogs(): Promise<AttendanceLog[]> {
        return this.getAllLogs();
    },

    async getAttendanceStats(): Promise<SubjectAttendanceStats[]> {
        const logs = await this.getAttendanceLogs();
        const subjects = await getSubjects();

        const validLogs = logs.filter(l => l.status !== 'Canceled');
        const statsMap = new Map<string, { total: number, present: number, name: string }>();

        subjects.forEach(s => {
            statsMap.set(s.id, { total: 0, present: 0, name: s.title });
        });

        validLogs.forEach(log => {
            const current = statsMap.get(log.subjectId) || { total: 0, present: 0, name: log.subjectName || 'Unknown' };
            current.total++;
            if (log.status === 'Present') {
                current.present++;
            }
            statsMap.set(log.subjectId, current);
        });

        return Array.from(statsMap.entries()).map(([id, stat]) => ({
            subjectId: id,
            subjectName: stat.name,
            totalClasses: stat.total,
            presentClasses: stat.present,
            percentage: stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0
        }));
    },

    async getDashboardData(daysToCheckMissing = 5): Promise<{
        stats: SubjectAttendanceStats[];
        subjects: Subject[];
        missingRecords: MissingRecord[];
    }> {
        const [logs, subjects, timetable] = await Promise.all([
            this.getAttendanceLogs(),
            getSubjects(),
            getTimetable()
        ]);

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

        const today = new Date();
        const missingRecords: MissingRecord[] = [];

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
                            date: new Date(dateString),
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

    async getKPICounts() {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const [subjectsData, assignmentsData, announcementsData] = await Promise.all([
            supabase.from('subjects').select('id', { count: 'exact', head: true }),
            supabase.from('assignments').select('id', { count: 'exact', head: true }),
            supabase.from('announcements').select('id', { count: 'exact', head: true })
        ]);

        return {
            totalSubjects: subjectsData.count || 0,
            totalAssignments: assignmentsData.count || 0,
            totalAnnouncements: announcementsData.count || 0
        };
    },

    async getAttendanceAlerts() {
        const stats = await this.getAttendanceStats();
        return stats
            .filter(s => s.percentage < 80)
            .map(s => {
                const target = 80;
                const classesNeeded = Math.ceil((target * s.totalClasses - 100 * s.presentClasses) / (100 - target));
                return {
                    subject: s.subjectName,
                    current: s.percentage,
                    classesNeeded: Math.max(0, classesNeeded)
                };
            })
            .sort((a, b) => a.current - b.current);
    },

    async getStudyStreak() {
        const user = await AuthService.getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('attendance_logs')
            .select('date, status')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (error || !data) return { currentStreak: 0, longestStreak: 0 };

        const uniqueDates = [...new Set(data.map(log => log.date))];
        const datesWithPresent = uniqueDates.filter(date =>
            data.some(log => log.date === date && log.status === 'Present')
        ).sort().reverse();

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < datesWithPresent.length; i++) {
            const logDate = new Date(datesWithPresent[i]);
            logDate.setHours(0, 0, 0, 0);

            if (i === 0) {
                const diffDays = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays <= 1) {
                    currentStreak = 1;
                    tempStreak = 1;
                } else {
                    break;
                }
            } else {
                const prevDate = new Date(datesWithPresent[i - 1]);
                prevDate.setHours(0, 0, 0, 0);
                const dayDiff = Math.floor((prevDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

                if (dayDiff === 1) {
                    tempStreak++;
                    if (i < 10) currentStreak = tempStreak;
                } else {
                    if (tempStreak > longestStreak) longestStreak = tempStreak;
                    tempStreak = 1;
                }
            }
        }

        if (tempStreak > longestStreak) longestStreak = tempStreak;
        return { currentStreak, longestStreak };
    }
};
