'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { getSemesters } from '@/lib/services/semester-service';
import { SubjectService } from '@/lib/data/subject-service';
import { supabase } from '@/utils/supabase/client';
import { Semester } from '@/types';

interface SubjectRow {
    id: string;
    code: string;
    title: string;
    description: string;
    unit_count: number;
    color: string;
    icon: string;
    progress: number;
    semester_id: string;
    gcr_keyword: string | null;
}

interface FormData {
    code: string;
    title: string;
    description: string;
    unitCount: number;
    color: string;
    icon: string;
    gcrKeyword: string;
}

const COLOR_OPTIONS = [
    { value: '#4f46e5', label: 'Indigo' },
    { value: '#059669', label: 'Emerald' },
    { value: '#f43f5e', label: 'Rose' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#0ea5e9', label: 'Sky' },
    { value: '#6366f1', label: 'Violet' },
    { value: '#10b981', label: 'Green' },
    { value: '#64748b', label: 'Slate' },
];

const defaultForm: FormData = {
    code: '',
    title: '',
    description: '',
    unitCount: 5,
    color: '#4f46e5',
    icon: 'BookOpen',
    gcrKeyword: '',
};

export function SubjectsAdminTab() {
    const [subjects, setSubjects] = useState<SubjectRow[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSemesters, setIsLoadingSemesters] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState<SubjectRow | null>(null);
    const [formData, setFormData] = useState<FormData>(defaultForm);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSemesters();
    }, []);

    useEffect(() => {
        if (selectedSemesterId) {
            loadSubjects(selectedSemesterId);

            const channel = supabase.channel('realtime_subjects')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'subjects', filter: `semester_id=eq.${selectedSemesterId}` }, () => {
                    loadSubjects(selectedSemesterId);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } else {
            setSubjects([]);
        }
    }, [selectedSemesterId]);

    async function loadSemesters() {
        setIsLoadingSemesters(true);
        const data = await getSemesters();
        setSemesters(data);
        if (data.length > 0) setSelectedSemesterId(data[0].id);
        setIsLoadingSemesters(false);
    }

    async function loadSubjects(semId: string) {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('subjects')
            .select('*')
            .eq('semester_id', semId)
            .order('code');

        if (error) {
            console.error('Error fetching subjects:', error);
        }
        setSubjects((data ?? []) as SubjectRow[]);
        setIsLoading(false);
    }

    function openAdd() {
        setEditingSubject(null);
        setFormData(defaultForm);
        setError(null);
        setShowAddModal(true);
    }

    function openEdit(subject: SubjectRow) {
        setEditingSubject(subject);
        setFormData({
            code: subject.code,
            title: subject.title,
            description: subject.description ?? '',
            unitCount: subject.unit_count,
            color: subject.color,
            icon: subject.icon,
            gcrKeyword: subject.gcr_keyword ?? '',
        });
        setError(null);
        setShowAddModal(true);
    }

    async function handleSave() {
        if (!formData.code.trim() || !formData.title.trim()) {
            setError('Code and Title are required.');
            return;
        }
        if (!selectedSemesterId) {
            setError('Please select a semester first.');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            if (editingSubject) {
                const { error } = await supabase
                    .from('subjects')
                    .update({
                        code: formData.code.toUpperCase(),
                        title: formData.title,
                        description: formData.description,
                        unit_count: formData.unitCount,
                        color: formData.color,
                        gcr_keyword: formData.gcrKeyword,
                    })
                    .eq('id', editingSubject.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('subjects')
                    .insert([{
                        id: crypto.randomUUID(),
                        semester_id: selectedSemesterId,
                        code: formData.code.toUpperCase(),
                        title: formData.title,
                        description: formData.description,
                        unit_count: formData.unitCount,
                        progress: 0,
                        color: formData.color,
                        icon: 'BookOpen',
                        gcr_keyword: formData.gcrKeyword,
                    }]);

                if (error) throw error;
            }

            SubjectService.invalidateCache();
            await loadSubjects(selectedSemesterId);
            setShowAddModal(false);
        } catch (e: any) {
            console.error(e);
            setError(e?.message ?? 'An unexpected error occurred.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(subject: SubjectRow) {
        if (!confirm(`Delete subject "${subject.title}"? This cannot be undone.`)) return;
        const { error } = await supabase.from('subjects').delete().eq('id', subject.id);
        if (error) {
            console.error(error);
            alert('Failed to delete subject.');
            return;
        }
        SubjectService.invalidateCache();
        setSubjects(prev => prev.filter(s => s.id !== subject.id));
    }

    const selectedSemester = semesters.find(s => s.id === selectedSemesterId);

    return (
        <div className="space-y-6">
            {/* Semester Selector */}
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
                        <p className="text-sm text-gray-400">
                            {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
                        </p>
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
                    Add Subject
                </button>
            </div>

            {/* No Semester Selected */}
            {!selectedSemesterId && !isLoadingSemesters && (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Icons.BookOpen size={32} className="text-indigo-400" />
                    </div>
                    <p className="text-gray-500 font-semibold">Select a semester to manage subjects</p>
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gray-100" />
                                <div className="h-3 bg-gray-100 rounded w-16" />
                            </div>
                            <div className="h-4 bg-gray-100 rounded w-2/3" />
                            <div className="h-3 bg-gray-100 rounded w-full" />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && selectedSemesterId && subjects.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Icons.Subjects size={32} className="text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-700 font-semibold">No subjects in {selectedSemester?.shortName}</p>
                        <p className="text-gray-400 text-sm mt-1">Add subjects to this semester.</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    >
                        Add First Subject
                    </button>
                </div>
            )}

            {/* Subjects Grid */}
            {!isLoading && subjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map(subject => (
                        <div
                            key={subject.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-100 transition-all group relative overflow-hidden"
                        >
                            {/* Color accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: subject.color }} />

                            <div className="flex items-start gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ backgroundColor: subject.color + '22' }}
                                >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-black text-xs tracking-wider text-gray-400 font-mono">{subject.code}</span>
                                    <p className="font-bold text-gray-900 text-sm leading-tight mt-0.5">{subject.title}</p>
                                    {subject.description && (
                                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{subject.description}</p>
                                    )}
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Icons.BookOpen size={11} className="text-indigo-400" />
                                        <span className="text-xs text-gray-400">{subject.unit_count} units</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEdit(subject)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-colors"
                                >
                                    <Icons.Edit size={13} />
                                </button>
                                <button
                                    onClick={() => handleDelete(subject)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                                >
                                    <Icons.Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white">
                            <h2 className="text-lg font-black text-gray-900">
                                {editingSubject ? 'Edit Subject' : 'Add Subject'}
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

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Code *</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={e => setFormData(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                        placeholder="e.g. PBA201"
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Unit Count</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.unitCount}
                                        onChange={e => setFormData(f => ({ ...f, unitCount: parseInt(e.target.value) || 5 }))}
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. Production and Operations Management"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Brief description of the subject…"
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Google Classroom Matching Keyword</label>
                                <input
                                    type="text"
                                    value={formData.gcrKeyword}
                                    onChange={e => setFormData(f => ({ ...f, gcrKeyword: e.target.value }))}
                                    placeholder="e.g. PBA211 or Python"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">Used to automatically match Google Classroom courses to this subject.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_OPTIONS.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setFormData(f => ({ ...f, color: c.value }))}
                                            className={cn(
                                                "w-8 h-8 rounded-lg transition-all",
                                                formData.color === c.value ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"
                                            )}
                                            style={{ backgroundColor: c.value }}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
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
                                {editingSubject ? 'Save Changes' : 'Create Subject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
