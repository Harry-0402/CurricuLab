"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { AttendanceService, SubjectAttendanceStats, AttendanceLog } from '@/lib/services/attendance-service';
import { getSubjects } from '@/lib/services/app.service';
import { getTimetable } from '@/lib/services/timetable-service';
import { Subject, TimetableEntry } from '@/types';
import { format, subDays, isSameDay, formatDistanceToNow, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';

export function AttendanceWidget() {
    const [stats, setStats] = useState<SubjectAttendanceStats[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [missingRecords, setMissingRecords] = useState<{ date: string, subjectId: string, subjectName: string, dayName: string }[]>([]);

    // Form State
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [status, setStatus] = useState<'Present' | 'Absent' | 'Canceled'>(() => {
        const today = new Date();
        return today.getDay() === 0 ? 'Canceled' : 'Absent';
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Logs Table State
    const [logs, setLogs] = useState<AttendanceLog[]>([]);
    const [filterSubject, setFilterSubject] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // KPI Counts
    const [kpiCounts, setKpiCounts] = useState({ totalSubjects: 0, totalAssignments: 0, totalAnnouncements: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { stats: fetchedStats, subjects: fetchedSubjects, missingRecords: missing } = await AttendanceService.getDashboardData(5);
            const fetchedLogs = await AttendanceService.getAllLogs();
            const kpiData = await AttendanceService.getKPICounts();
            const fetchedTimetable = await getTimetable();

            setStats(fetchedStats);
            setSubjects(fetchedSubjects);
            setMissingRecords(missing);
            setLogs(fetchedLogs);
            setKpiCounts(kpiData);
            setTimetable(fetchedTimetable);

            // Set first subject from filtered list based on today
            const todayDayName = format(new Date(), 'EEEE');
            const scheduledToday = fetchedTimetable.filter(t => t.day === todayDayName);
            const scheduledSubjects = fetchedSubjects.filter(s =>
                scheduledToday.some(t => t.subjectCode === s.code || t.subjectTitle === s.title)
            );
            if (scheduledSubjects.length > 0 && !selectedSubject) {
                setSelectedSubject(scheduledSubjects[0].id);
            }
        } catch (error) {
            console.error('Failed to load attendance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !selectedSubject) return;

        setIsSubmitting(true);
        try {
            await AttendanceService.logAttendance(selectedDate, selectedSubject, status);
            await loadData(); // Refresh everything
            // Reset to Absent for next entry
            setStatus('Absent');
        } catch (error: any) {
            alert(`Failed to log attendance: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-set status based on day of week
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        const dayOfWeek = new Date(date).getDay();
        const dayName = format(new Date(date), 'EEEE');

        // Sunday = 0
        if (dayOfWeek === 0) {
            setStatus('Canceled');
        } else {
            setStatus('Absent');
        }

        // Auto-select first subject scheduled on this day
        const scheduledOnDay = timetable.filter(t => t.day === dayName);
        const scheduledSubjects = subjects.filter(s =>
            scheduledOnDay.some(t => t.subjectCode === s.code || t.subjectTitle === s.title)
        );
        if (scheduledSubjects.length > 0) {
            setSelectedSubject(scheduledSubjects[0].id);
        }
    };

    const handleQuickLog = async (record: { date: string, subjectId: string }, status: 'Present' | 'Absent') => {
        try {
            await AttendanceService.logAttendance(record.date, record.subjectId, status);
            // Optimistically remove from list
            setMissingRecords(prev => prev.filter(r => !(r.date === record.date && r.subjectId === record.subjectId)));
            // Refresh stats in background
            const newStats = await AttendanceService.getAttendanceStats();
            setStats(newStats);
        } catch (error: any) {
            alert(`Failed to quick log: ${error.message}`);
        }
    };

    // Table Handlers
    const handleDeleteLog = async (logId: string) => {
        if (confirm('Delete this attendance record?')) {
            try {
                await AttendanceService.deleteLog(logId);
                await loadData();
            } catch (error: any) {
                alert(`Failed to delete: ${error.message}`);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedLogs.size === 0) return;
        if (confirm(`Delete ${selectedLogs.size} selected records?`)) {
            try {
                await AttendanceService.bulkDeleteLogs(Array.from(selectedLogs));
                setSelectedLogs(new Set());
                await loadData();
            } catch (error: any) {
                alert(`Failed to delete: ${error.message}`);
            }
        }
    };

    const handleToggleLog = (logId: string) => {
        const newSelected = new Set(selectedLogs);
        if (newSelected.has(logId)) {
            newSelected.delete(logId);
        } else {
            newSelected.add(logId);
        }
        setSelectedLogs(newSelected);
    };

    const handleToggleAll = () => {
        if (selectedLogs.size === filteredLogs.length) {
            setSelectedLogs(new Set());
        } else {
            setSelectedLogs(new Set(filteredLogs.map(log => log.id)));
        }
    };

    const exportToCSV = () => {
        const csv = [
            ['Date', 'Day', 'Subject', 'Status', 'Logged At'].join(','),
            ...filteredLogs.map(log => [
                log.date,
                format(new Date(log.date), 'EEEE'),
                `"${log.subjectName}"`,
                log.status,
                format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss')
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${format(currentMonth, 'yyyy-MM')}.csv`;
        a.click();
    };

    // Filtered logs
    const filteredLogs = logs
        .filter(log => filterSubject === 'All' || log.subjectId === filterSubject)
        .filter(log => filterStatus === 'All' || log.status === filterStatus)
        .filter(log => {
            const logDate = new Date(log.date);
            const monthStart = startOfMonth(currentMonth);
            const monthEnd = endOfMonth(currentMonth);
            return logDate >= monthStart && logDate <= monthEnd;
        });

    // Month days for full calendar view
    const monthDays = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    // Filtered subjects based on selected date's timetable
    const dayName = format(new Date(selectedDate), 'EEEE');
    const scheduledOnSelectedDay = timetable.filter(t => t.day === dayName);
    const availableSubjects = subjects.filter(s =>
        scheduledOnSelectedDay.some(t => t.subjectCode === s.code || t.subjectTitle === s.title)
    );

    const overallPercentage = stats.reduce((acc, curr) => acc + (curr.totalClasses > 0 ? (curr.presentClasses / curr.totalClasses) : 0), 0) / (stats.filter(s => s.totalClasses > 0).length || 1) * 100;
    const totalClasses = stats.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const totalPresent = stats.reduce((acc, curr) => acc + curr.presentClasses, 0);
    const actualOverall = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

    if (loading) return <div className="p-8 text-center text-gray-400">Loading attendance...</div>;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Stats Card */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-gray-900">Attendance Overview</h3>
                        <div className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                            Semester Total
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" className="stroke-gray-100" strokeWidth="8" fill="none" />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    className={cn("transition-all duration-1000 ease-out",
                                        actualOverall >= 80 ? "stroke-green-500" : actualOverall >= 60 ? "stroke-yellow-500" : "stroke-red-500"
                                    )}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray="251.2"
                                    strokeDashoffset={251.2 - (251.2 * actualOverall) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-gray-900">{actualOverall}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Total Classes: <span className="text-gray-900">{totalClasses}</span></p>
                            <p className="text-sm font-bold text-gray-500">Present: <span className="text-gray-900">{totalPresent}</span></p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Target: 80%</p>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {stats.map(stat => (
                            <div key={stat.subjectId} className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-700 truncate w-1/2" title={stat.subjectName}>{stat.subjectName}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400 text-xs">{stat.presentClasses}/{stat.totalClasses}</span>
                                    <span className={cn("font-bold w-8 text-right",
                                        stat.percentage >= 80 ? "text-green-600" : stat.percentage >= 60 ? "text-yellow-600" : "text-red-600"
                                    )}>
                                        {stat.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                        {stats.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No attendance data yet.</p>}
                    </div>
                </div>

                {/* Right Column - KPI Cards + Actions */}
                <div className="space-y-6">
                    {/* KPI Cards - Side by Side */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-[20px] shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Total Subjects</p>
                                    <p className="text-white text-3xl font-black">{kpiCounts.totalSubjects}</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Icons.BookOpen size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-[20px] shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest mb-1">Total Assignments</p>
                                    <p className="text-white text-3xl font-black">{kpiCounts.totalAssignments}</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Icons.FileText size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-[20px] shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest mb-1">Total Announcements</p>
                                    <p className="text-white text-3xl font-black">{kpiCounts.totalAnnouncements}</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Icons.Bell size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mark Attendance */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-xl text-gray-900 mb-6">Mark Attendance</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={selectedDate}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Subject</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                        disabled={availableSubjects.length === 0}
                                    >
                                        {availableSubjects.length === 0 ? (
                                            <option value="">- No classes scheduled -</option>
                                        ) : (
                                            availableSubjects.map(s => (
                                                <option key={s.id} value={s.id}>{s.title}</option>
                                            ))
                                        )}
                                    </select>
                                    {availableSubjects.length === 0 && (
                                        <p className="text-xs text-orange-600 mt-1 font-medium">No subjects scheduled on {dayName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl">
                                {(['Present', 'Absent', 'Canceled'] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setStatus(s)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                                            status === s
                                                ? (s === 'Present' ? "bg-green-100 text-green-700 shadow-sm" : s === 'Absent' ? "bg-red-100 text-red-700 shadow-sm" : "bg-gray-200 text-gray-700 shadow-sm")
                                                : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <Button type="submit" className="w-full rounded-xl py-6" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Log Attendance'}
                            </Button>
                        </form>
                    </div>

                    {/* Missing Records Suggestions */}
                    {missingRecords.length > 0 && (
                        <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100">
                            <div className="flex items-center gap-3 mb-4 text-orange-800">
                                <Icons.AlertTriangle size={18} />
                                <h4 className="font-bold text-sm">Missing Records (Last 5 Days)</h4>
                            </div>
                            <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
                                {missingRecords.map((record, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-xl border border-orange-100/50 shadow-sm flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">{record.subjectName}</p>
                                            <p className="text-[10px] text-gray-400">{record.dayName} • {format(new Date(record.date), 'MMM d')}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleQuickLog(record, 'Present')}
                                                className="w-7 h-7 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
                                                title="Mark Present"
                                            >
                                                <Icons.Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleQuickLog(record, 'Absent')}
                                                className="w-7 h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                                                title="Mark Absent"
                                            >
                                                <Icons.X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Attendance Logs Table - Full Width */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-xl text-gray-900">Attendance Logs</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            Showing {filteredLogs.length} record(s) for {format(currentMonth, 'MMMM yyyy')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Previous month"
                        >
                            <Icons.ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setCurrentMonth(new Date())}
                            className="px-3 py-1 text-xs font-bold hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Next month"
                        >
                            <Icons.ChevronRight size={18} />
                        </button>
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="px-3 py-2 bg-gray-50 border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="All">All Subjects</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 bg-gray-50 border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="All">All Status</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                        {selectedLogs.size > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                            >
                                Delete ({selectedLogs.size})
                            </button>
                        )}
                        <button
                            onClick={exportToCSV}
                            className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors flex items-center gap-2"
                        >
                            <Icons.Download size={14} />
                            CSV
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="flex items-center gap-4 mb-6 text-xs font-medium">
                    <span className="text-gray-600">Total: <span className="font-bold">{filteredLogs.length}</span></span>
                    <span className="text-green-600">Present: <span className="font-bold">{filteredLogs.filter(l => l.status === 'Present').length}</span></span>
                    <span className="text-red-600">Absent: <span className="font-bold">{filteredLogs.filter(l => l.status === 'Absent').length}</span></span>
                    <span className="text-gray-600">Canceled: <span className="font-bold">{filteredLogs.filter(l => l.status === 'Canceled').length}</span></span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedLogs.size === filteredLogs.length && filteredLogs.length > 0}
                                        onChange={handleToggleAll}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Subject</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Logged</th>
                                <th className="px-4 py-3 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Icons.Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-400 font-medium text-sm">No attendance logs for this period</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map(log => (
                                    <tr key={log.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedLogs.has(log.id)}
                                                onChange={() => handleToggleLog(log.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">
                                                    {format(new Date(log.date), 'MMM d, yyyy')}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {format(new Date(log.date), 'EEEE')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-sm text-gray-900">{log.subjectName}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold",
                                                log.status === 'Present' && "bg-green-100 text-green-700",
                                                log.status === 'Absent' && "bg-red-100 text-red-700",
                                                log.status === 'Canceled' && "bg-gray-100 text-gray-700"
                                            )}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleDeleteLog(log.id)}
                                                    className="w-8 h-8 hover:bg-red-50 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icons.Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
