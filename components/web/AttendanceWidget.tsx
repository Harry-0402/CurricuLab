"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { AttendanceService, SubjectAttendanceStats } from '@/lib/services/attendance-service';
import { getSubjects } from '@/lib/services/app.service';
import { Subject } from '@/types';
import { format, subDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

export function AttendanceWidget() {
    const [stats, setStats] = useState<SubjectAttendanceStats[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [missingRecords, setMissingRecords] = useState<{ date: string, subjectId: string, subjectName: string, dayName: string }[]>([]);

    // Form State
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [status, setStatus] = useState<'Present' | 'Absent' | 'Canceled'>('Present');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [fetchedStats, fetchedSubjects, missing] = await Promise.all([
                AttendanceService.getAttendanceStats(),
                getSubjects(),
                AttendanceService.getMissingRecords(5)
            ]);
            setStats(fetchedStats);
            setSubjects(fetchedSubjects);
            setMissingRecords(missing);
            if (fetchedSubjects.length > 0) {
                setSelectedSubject(fetchedSubjects[0].id);
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
            // Reset form slightly
            setStatus('Present');
        } catch (error: any) {
            alert(`Failed to log attendance: ${error.message}`);
        } finally {
            setIsSubmitting(false);
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

    const overallPercentage = stats.reduce((acc, curr) => acc + (curr.totalClasses > 0 ? (curr.presentClasses / curr.totalClasses) : 0), 0) / (stats.filter(s => s.totalClasses > 0).length || 1) * 100;
    const totalClasses = stats.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const totalPresent = stats.reduce((acc, curr) => acc + curr.presentClasses, 0);
    const actualOverall = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

    if (loading) return <div className="p-8 text-center text-gray-400">Loading attendance...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stats Card */}
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
                                    actualOverall >= 75 ? "stroke-green-500" : actualOverall >= 60 ? "stroke-yellow-500" : "stroke-red-500"
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
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Target: 75%</p>
                    </div>
                </div>

                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {stats.map(stat => (
                        <div key={stat.subjectId} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700 truncate w-1/2" title={stat.subjectName}>{stat.subjectName}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-xs">{stat.presentClasses}/{stat.totalClasses}</span>
                                <span className={cn("font-bold w-8 text-right",
                                    stat.percentage >= 75 ? "text-green-600" : stat.percentage >= 60 ? "text-yellow-600" : "text-red-600"
                                )}>
                                    {stat.percentage}%
                                </span>
                            </div>
                        </div>
                    ))}
                    {stats.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No attendance data yet.</p>}
                </div>
            </div>

            {/* Actions Card */}
            <div className="space-y-8">
                {/* Manual Log */}
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
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                                >
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
                                    ))}
                                </select>
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
    );
}
