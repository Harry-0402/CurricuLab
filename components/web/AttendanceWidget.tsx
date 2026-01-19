"use client"

import React, { useState, useEffect } from 'react';
import { format, isSameDay, getDay } from 'date-fns';
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

export function AttendanceWidget() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [missingRecords, setMissingRecords] = useState<MissingRecord[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [status, setStatus] = useState<'Present' | 'Absent' | 'Canceled'>('Absent');

    // Logs Table State
    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [filterSubject, setFilterSubject] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // KPI Counts
    const [kpiCounts, setKpiCounts] = useState({ totalSubjects: 0, totalAssignments: 0 });

    // Feature Data
    const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState<Assignment[]>([]);
    const [attendanceAlerts, setAttendanceAlerts] = useState<{ subject: string, current: number, classesNeeded: number }[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { stats: fetchedStats, subjects: fetchedSubjects, missingRecords: missing } = await AttendanceService.getDashboardData(5);
            setStats(fetchedStats);
            setSubjects(fetchedSubjects);
            setMissingRecords(missing);

            const allLogs = await AttendanceService.getAllLogs();
            setLogs(allLogs);

            const kpis = await AttendanceService.getKPICounts();
            setKpiCounts(kpis);

            const currentStreak = await AttendanceService.getStudyStreak();
            setStreak(currentStreak);

            const myReminders = await ReminderService.getAllReminders();
            setReminders(myReminders);

            const deadlines = await getUpcomingAssignments(14);
            setUpcomingDeadlines(deadlines);

            const alerts = await AttendanceService.getAttendanceAlerts();
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
            const timetable = await getTimetable();
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
                status
            );
            await loadData();
            // Reset to defaults for next entry if needed, but keeping date/subject allows quick repeated entry
        } catch (error) {
            console.error('Failed to log attendance', error);
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
        if (!confirm('Are you sure you want to delete this log?')) return;
        try {
            await AttendanceService.deleteLog(id);
            await loadData();
        } catch (error) {
            console.error('Failed to delete log', error);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedLogs.size} logs?`)) return;
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
        if (!confirm("Delete this reminder?")) return;
        try {
            await ReminderService.deleteReminder(id);
            await loadData();
        } catch (error) {
            console.error('Failed to delete reminder', error);
        }
    };

    const dayName = format(new Date(selectedDate), 'EEEE');

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Mark Attendance + Stats */}
                <div className="space-y-6">
                    <MarkAttendanceForm
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        selectedSubject={selectedSubject}
                        onSubjectChange={setSelectedSubject}
                        availableSubjects={availableSubjects}
                        dayName={dayName}
                        status={status}
                        onStatusChange={setStatus}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />

                    <AttendanceStatsCard stats={stats} loading={loading} />

                    <MissingRecordsSuggestions
                        missingRecords={missingRecords}
                        onQuickLog={handleQuickLog}
                    />
                </div>

                {/* Right Column - KPI Cards + Actions */}
                <div className="space-y-6">
                    <KPICards counts={kpiCounts} />

                    <ProgressSection
                        streak={streak}
                        reminders={reminders}
                        onAddReminder={handleAddReminder}
                        onToggleReminder={handleToggleReminder}
                        onDeleteReminder={handleDeleteReminder}
                    />

                    <AlertsSection
                        upcomingDeadlines={upcomingDeadlines}
                        attendanceAlerts={attendanceAlerts}
                    />
                </div>
            </div>

            <AttendanceLogsTable
                logs={logs}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                filterSubject={filterSubject}
                onFilterSubjectChange={setFilterSubject}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                subjects={subjects}
                selectedLogs={selectedLogs}
                onToggleSelectLog={handleToggleSelectLog}
                onToggleSelectAll={handleToggleSelectAll}
                onDeleteLog={handleDeleteLog}
                onBulkDelete={handleBulkDelete}
            />
        </>
    );
}
