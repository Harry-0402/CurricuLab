"use client"

import React, { useState, useEffect } from 'react';
import { format, isSameDay, getDay } from 'date-fns';
import { toast } from 'sonner';
import { AttendanceService, AttendanceLog, MissingRecord } from '@/lib/services/attendance-service';
import { ReminderService, Reminder } from '@/lib/services/reminder-service';
import { getUpcomingAssignments } from '@/lib/services/app.service';
import { getTimetable } from '@/lib/services/timetable-service';
import { Subject, Assignment } from '@/types';
import { KPICards } from './attendance/KPICards';
import { AttendanceStatsCard } from './attendance/AttendanceStatsCard';
import { MarkAttendanceForm } from './attendance/MarkAttendanceForm';
import { ProgressSection } from './attendance/ProgressSection';
import { AlertsSection } from './attendance/AlertsSection';
import { AttendanceLogsTable } from './attendance/AttendanceLogsTable';
import { MissingRecordsSuggestions } from './attendance/MissingRecordsSuggestions';
import { useSemester } from '../providers/SemesterProvider';

export function AttendanceWidget() {
    const { enrolledSemesterId } = useSemester();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [missingRecords, setMissingRecords] = useState<MissingRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [status, setStatus] = useState<'Present' | 'Absent' | 'Canceled'>('Absent');
    const [verificationImage, setVerificationImage] = useState<Blob | null>(null);

    // Logs Table State
    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [filterSubject, setFilterSubject] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
    const [currentMonth, setCurrentMonth] = useState<Date | null>(null);

    useEffect(() => {
        // Hydration fix: Set initial dates only after component mounts on client
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setCurrentMonth(new Date());
    }, []);

    // KPI Counts
    const [kpiCounts, setKpiCounts] = useState({ totalSubjects: 0, totalAssignments: 0 });

    // Feature Data
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState<Assignment[]>([]);
    const [attendanceAlerts, setAttendanceAlerts] = useState<{ subject: string, current: number, classesNeeded: number }[]>([]);

    useEffect(() => {
        if (enrolledSemesterId !== undefined) {
            loadData();
        }
    }, [enrolledSemesterId]);

    const loadData = async () => {
        if (!enrolledSemesterId) return; // Wait until enrolled
        setLoading(true);
        try {
            const { stats: fetchedStats, subjects: fetchedSubjects, missingRecords: missing } = await AttendanceService.getDashboardData(enrolledSemesterId, 5);
            setStats(fetchedStats);
            setSubjects(fetchedSubjects);
            setMissingRecords(missing);

            const allLogs = await AttendanceService.getAllLogs();
            setLogs(allLogs);

            const kpis = await AttendanceService.getKPICounts(enrolledSemesterId);
            setKpiCounts(kpis);

            const myReminders = await ReminderService.getAllReminders();
            setReminders(myReminders);

            const deadlines = await getUpcomingAssignments(14, enrolledSemesterId);
            setUpcomingDeadlines(deadlines);

            const alerts = await AttendanceService.getAttendanceAlerts(enrolledSemesterId);
            setAttendanceAlerts(alerts);

            updateAvailableSubjects(selectedDate, fetchedSubjects);
        } catch (error) {
            console.error('Failed to load attendance data', error);
        } finally {
            setLoading(false);
        }
    };

    const updateAvailableSubjects = async (date: string, allSubjects: Subject[]) => {
        const dayOfWeek = getDay(new Date(date));
        const dayName = format(new Date(date), 'EEEE');

        try {
            const timetable = await getTimetable(enrolledSemesterId || undefined);
            const scheduledForDay = timetable.filter(t => t.day === dayName);

            if (scheduledForDay.length > 0) {
                // Map scheduled classes to subject IDs by matching title or code
                const scheduledSubjectIds = new Set(
                    scheduledForDay.map(t => {
                        const subject = allSubjects.find(s => s.code === t.subjectCode || s.title === t.subjectTitle);
                        return subject ? subject.id : null;
                    }).filter(id => id !== null) as string[]
                );

                const filtered = allSubjects.filter(s => scheduledSubjectIds.has(s.id));
                setAvailableSubjects(filtered);
                if (filtered.length > 0) {
                    setSelectedSubject(filtered[0].id);
                } else {
                    setSelectedSubject('');
                }
            } else {
                setAvailableSubjects([]);
                setSelectedSubject('');
            }
        } catch (error) {
            console.error("Error fetching timetable:", error);
            setAvailableSubjects(allSubjects);
        }

        // Auto-set status
        if (dayOfWeek === 0) { // Sunday
            setStatus('Canceled');
        } else {
            setStatus('Absent');
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        updateAvailableSubjects(date, subjects);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubject) return;

        setIsSubmitting(true);
        try {
            await AttendanceService.logAttendance(
                selectedDate,
                selectedSubject,
                status,
                verificationImage || undefined
            );
            await loadData();
            // Reset verification image after success
            setVerificationImage(null);
        } catch (error) {
            console.error('Failed to log attendance', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDailyCheckIn = async (blob: Blob) => {
        setIsSubmitting(true);
        try {
            await AttendanceService.markDailyAttendance(selectedDate, blob, enrolledSemesterId);
            await loadData();
        } catch (error: any) {
            console.error('Failed daily check-in', error);
            toast.error("Check-in failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickLog = async (record: MissingRecord, status: 'Present' | 'Absent') => {
        try {
            await AttendanceService.logAttendance(
                format(new Date(record.date), 'yyyy-MM-dd'),
                record.subjectId,
                status
            );
            await loadData();
        } catch (error) {
            console.error('Failed to quick log', error);
        }
    };

    // --- Bulk Log Actions ---
    const handleToggleSelectLog = (id: string) => {
        const newSelected = new Set(selectedLogs);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedLogs(newSelected);
    };

    const handleToggleSelectAll = () => {
        if (selectedLogs.size === logs.length) {
            setSelectedLogs(new Set());
        } else {
            setSelectedLogs(new Set(logs.map(l => l.id)));
        }
    };

    const handleDeleteLog = async (id: string) => {
        try {
            await AttendanceService.deleteLog(id);
            await loadData();
        } catch (error) {
            console.error('Failed to delete log', error);
        }
    };

    const handleUpdateLogStatus = async (id: string, newStatus: 'Present' | 'Absent' | 'Canceled') => {
        try {
            await AttendanceService.updateLogStatus(id, newStatus);
            await loadData();
        } catch (error) {
            console.error('Failed to update log status', error);
        }
    };

    const handleBulkDelete = async () => {
        try {
            await AttendanceService.bulkDeleteLogs(Array.from(selectedLogs));
            setSelectedLogs(new Set());
            await loadData();
        } catch (error) {
            console.error('Failed to bulk delete', error);
        }
    };

    // --- Reminder Actions ---
    const handleAddReminder = async (title: string, date: string) => {
        try {
            await ReminderService.createReminder(title, date);
            await loadData();
        } catch (error) {
            console.error('Failed to add reminder', error);
        }
    };

    const handleToggleReminder = async (id: string, isCompleted: boolean) => {
        try {
            await ReminderService.toggleComplete(id); // Fixed: specific API usually toggles, explicit check logic might differ
            await loadData();
        } catch (error) {
            console.error('Failed to toggle reminder', error);
        }
    };

    const handleDeleteReminder = async (id: string) => {
        try {
            await ReminderService.deleteReminder(id);
            await loadData();
        } catch (error) {
            console.error('Failed to delete reminder', error);
        }
    };
    const dayName = selectedDate ? format(new Date(selectedDate), 'EEEE') : '';

    return (
        <>
            <div className="space-y-8">
                <KPICards counts={kpiCounts} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProgressSection
                        reminders={reminders}
                        onAddReminder={handleAddReminder}
                        onToggleReminder={handleToggleReminder}
                        onDeleteReminder={handleDeleteReminder}
                    />

                    <AlertsSection
                        upcomingDeadlines={upcomingDeadlines}
                    />
                </div>
            </div>

            {/* Attendance Logs Table removed */}
        </>
    );
}
