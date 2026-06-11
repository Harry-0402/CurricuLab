'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { getSemesters } from '@/lib/services/semester-service';
import { supabase } from '@/utils/supabase/client';
import { Semester } from '@/types';

interface TimetableEntry {
    id: string;
    semester_id: string;
    day: string;
    subject_title: string;
    subject_code: string;
    location: string;
    start_time: string;
    end_time: string;
    teacher: string;
}

interface FormData {
    day: string;
    subjectTitle: string;
    subjectCode: string;
    location: string;
    startTime: string;
    endTime: string;
    teacher: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DAY_COLORS: Record<string, string> = {
    Monday: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Tuesday: 'bg-violet-50 text-violet-700 border-violet-100',
    Wednesday: 'bg-blue-50 text-blue-700 border-blue-100',
    Thursday: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Friday: 'bg-amber-50 text-amber-700 border-amber-100',
    Saturday: 'bg-rose-50 text-rose-700 border-rose-100',
};

const defaultForm: FormData = {
    day: 'Monday',
    subjectTitle: '',
    subjectCode: '',
    location: '',
    startTime: '09:00',
    endTime: '10:30',
    teacher: '',
};

function formatTime(time: string): string {
    if (!time) return '';
    if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) return time;
    try {
        const [h, m] = time.split(':').map(Number);
        if (isNaN(h) || isNaN(m)) return time;
        const period = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${String(m).padStart(2, '0')} ${period}`;
    } catch {
        return time;
    }
}

export function TimetableAdminTab() {
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSemesters, setIsLoadingSemesters] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
    const [formData, setFormData] = useState<FormData>(defaultForm);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSemesters();
    }, []);

    useEffect(() => {
        if (selectedSemesterId) {
            loadEntries(selectedSemesterId);

            const channel = supabase.channel('realtime_timetable')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'timetable', filter: `semester_id=eq.${selectedSemesterId}` }, () => {
                    loadEntries(selectedSemesterId);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } else {
            setEntries([]);
        }
    }, [selectedSemesterId]);

    async function loadSemesters() {
        setIsLoadingSemesters(true);
        const data = await getSemesters();
        setSemesters(data);
        if (data.length > 0) setSelectedSemesterId(data[0].id);
        setIsLoadingSemesters(false);
    }

    async function loadEntries(semId: string) {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('timetable')
            .select('*')
            .eq('semester_id', semId)
            .order('day')
            .order('start_time');

        if (error) console.error('Error fetching timetable:', error);
        setEntries((data ?? []) as TimetableEntry[]);
        setIsLoading(false);
    }

    function openAdd() {
        setEditingEntry(null);
        setFormData(defaultForm);
        setError(null);
        setShowAddModal(true);
    }

    function openEdit(entry: TimetableEntry) {
        setEditingEntry(entry);
        setFormData({
            day: entry.day,
            subjectTitle: entry.subject_title,
            subjectCode: entry.subject_code,
            location: entry.location ?? '',
            startTime: entry.start_time,
            endTime: entry.end_time,
            teacher: entry.teacher ?? '',
        });
        setError(null);
        setShowAddModal(true);
    }

    async function handleSave() {
        if (!formData.subjectTitle.trim() || !formData.startTime || !formData.endTime) {
            setError('Day, Subject Title, Start Time, and End Time are required.');
            return;
        }
        if (!selectedSemesterId) {
            setError('Please select a semester first.');
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            if (editingEntry) {
                const { error } = await supabase
                    .from('timetable')
                    .update({
                        day: formData.day,
                        subject_title: formData.subjectTitle,
                        subject_code: formData.subjectCode.toUpperCase(),
                        location: formData.location,
                        start_time: formData.startTime,
                        end_time: formData.endTime,
                        teacher: formData.teacher,
                    })
                    .eq('id', editingEntry.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('timetable')
                    .insert([{
                        id: crypto.randomUUID(),
                        semester_id: selectedSemesterId,
                        day: formData.day,
                        subject_title: formData.subjectTitle,
                        subject_code: formData.subjectCode.toUpperCase(),
                        location: formData.location,
                        start_time: formData.startTime,
                        end_time: formData.endTime,
                        teacher: formData.teacher,
                    }]);

                if (error) throw error;
            }

            await loadEntries(selectedSemesterId);
            setShowAddModal(false);
        } catch (e: any) {
            console.error(e);
            setError(e?.message ?? 'An unexpected error occurred.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(entry: TimetableEntry) {
        if (!confirm(`Delete this timetable entry (${entry.subject_title} on ${entry.day})?`)) return;
        const { error } = await supabase.from('timetable').delete().eq('id', entry.id);
        if (error) {
            console.error(error);
            alert('Failed to delete entry.');
        } else {
            setEntries(prev => prev.filter(e => e.id !== entry.id));
        }
    }

    // Group entries by day
    const grouped = DAYS.reduce<Record<string, TimetableEntry[]>>((acc, day) => {
        acc[day] = entries.filter(e => e.day === day);
        return acc;
    }, {});

    const hasAnyEntries = entries.length > 0;
    const selectedSemester = semesters.find(s => s.id === selectedSemesterId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    {isLoadingSemesters ? (
                        <div className="h-9 w-48 bg-gray-100 rounded-xl animate-pulse" />
                    ) : (
                        <div className="relative">
                            <select
                                value={selectedSemesterId}
                                onChange={e => setSelectedSemesterId(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-9 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                {semesters.length === 0 && <option value="">No semesters</option>}
                                {semesters.map(s => (
                                    <option key={s.id} value={s.id}>{s.shortName} – {s.programName ?? ''}</option>
                                ))}
                            </select>
                            <Icons.ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                    {selectedSemesterId && !isLoading && (
                        <p className="text-sm text-gray-400">{entries.length} class{entries.length !== 1 ? 'es' : ''} scheduled</p>
                    )}
                </div>
                <button
                    onClick={openAdd}
                    disabled={!selectedSemesterId}
                    className={cn(
                        "flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors",
                        !selectedSemesterId ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                >
                    <Icons.Plus size={16} />
                    Add Entry
                </button>
            </div>

            {/* No semester selected */}
            {!selectedSemesterId && !isLoadingSemesters && (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Icons.Clock size={32} className="text-indigo-400" />
                    </div>
                    <p className="text-gray-500 font-semibold">Select a semester to view the timetable</p>
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="space-y-4">
                    {DAYS.slice(0, 3).map(day => (
                        <div key={day} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-24" />
                            <div className="space-y-2">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-14 bg-gray-50 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && selectedSemesterId && !hasAnyEntries && (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Icons.Clock size={32} className="text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-700 font-semibold">No timetable entries for {selectedSemester?.shortName}</p>
                        <p className="text-gray-400 text-sm mt-1">Add class sessions to build the schedule.</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    >
                        Add First Entry
                    </button>
                </div>
            )}

            {/* Timetable by Day */}
            {!isLoading && hasAnyEntries && (
                <div className="space-y-4">
                    {DAYS.map(day => {
                        const dayEntries = grouped[day];
                        if (dayEntries.length === 0) return null;

                        return (
                            <div key={day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Day Header */}
                                <div className={cn("px-5 py-3 flex items-center gap-2 border-b", DAY_COLORS[day] ?? 'border-gray-100')}>
                                    <Icons.Calendar size={14} />
                                    <span className="text-sm font-black">{day}</span>
                                    <span className="ml-auto text-xs font-semibold opacity-60">
                                        {dayEntries.length} class{dayEntries.length !== 1 ? 'es' : ''}
                                    </span>
                                </div>

                                {/* Entries */}
                                <div className="divide-y divide-gray-50">
                                    {dayEntries.map(entry => (
                                        <div key={entry.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors group">
                                            {/* Time */}
                                            <div className="w-28 flex-shrink-0">
                                                <p className="text-xs font-black text-gray-700">
                                                    {formatTime(entry.start_time)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {formatTime(entry.end_time)}
                                                </p>
                                            </div>

                                            {/* Subject */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-bold text-gray-900">{entry.subject_title}</p>
                                                    {entry.subject_code && (
                                                        <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full tracking-widest font-mono">
                                                            {entry.subject_code}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                                    {entry.location && (
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Icons.MapPin size={10} />
                                                            {entry.location}
                                                        </span>
                                                    )}
                                                    {entry.teacher && (
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Icons.User size={10} />
                                                            {entry.teacher}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(entry)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-colors"
                                                >
                                                    <Icons.Edit size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(entry)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                                                >
                                                    <Icons.Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white">
                            <h2 className="text-lg font-black text-gray-900">
                                {editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                                <Icons.X size={18} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100">
                                    <Icons.AlertTriangle size={15} className="flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Day *</label>
                                <div className="relative">
                                    <select
                                        value={formData.day}
                                        onChange={e => setFormData(f => ({ ...f, day: e.target.value }))}
                                        className="w-full appearance-none border border-gray-200 rounded-xl pl-3.5 pr-9 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <Icons.ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Start Time *</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={e => setFormData(f => ({ ...f, startTime: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">End Time *</label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={e => setFormData(f => ({ ...f, endTime: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject Title *</label>
                                <input
                                    type="text"
                                    value={formData.subjectTitle}
                                    onChange={e => setFormData(f => ({ ...f, subjectTitle: e.target.value }))}
                                    placeholder="e.g. Production and Operations Management"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject Code</label>
                                    <input
                                        type="text"
                                        value={formData.subjectCode}
                                        onChange={e => setFormData(f => ({ ...f, subjectCode: e.target.value.toUpperCase() }))}
                                        placeholder="e.g. PBA204"
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                                        placeholder="e.g. Room 301"
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Teacher / Faculty</label>
                                <input
                                    type="text"
                                    value={formData.teacher}
                                    onChange={e => setFormData(f => ({ ...f, teacher: e.target.value }))}
                                    placeholder="e.g. Dr. Priya Mehta"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors",
                                    isSaving ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                                )}
                            >
                                {isSaving ? <Icons.Loader2 size={15} className="animate-spin" /> : <Icons.Save size={15} />}
                                {editingEntry ? 'Save Changes' : 'Add Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
