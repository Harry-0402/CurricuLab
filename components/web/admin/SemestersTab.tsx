'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import {
    getPrograms,
    getSemesters,
    createSemester,
    updateSemester,
    deleteSemester,
} from '@/lib/services/semester-service';
import { Program, Semester } from '@/types';

interface FormData {
    programId: string;
    name: string;
    shortName: string;
    number: number;
    academicYear: string;
    isActive: boolean;
}

const defaultForm: FormData = {
    programId: '',
    name: '',
    shortName: '',
    number: 1,
    academicYear: '',
    isActive: true,
};

export function SemestersTab() {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
    const [selectedProgramFilter, setSelectedProgramFilter] = useState<string>('all');
    const [formData, setFormData] = useState<FormData>(defaultForm);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadAll() {
        setIsLoading(true);
        const [progs, sems] = await Promise.all([getPrograms(), getSemesters()]);
        setPrograms(progs);
        setSemesters(sems);
        setIsLoading(false);
    }

    useEffect(() => {
        loadAll();

        const { supabase } = require('@/utils/supabase/client');
        const channel = supabase.channel('realtime_semesters')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'semesters' }, () => {
                loadAll();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, () => {
                loadAll();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    function openAdd() {
        setEditingSemester(null);
        setFormData({ ...defaultForm, programId: programs[0]?.id ?? '' });
        setError(null);
        setShowAddModal(true);
    }

    function openEdit(sem: Semester) {
        setEditingSemester(sem);
        setFormData({
            programId: sem.programId,
            name: sem.name,
            shortName: sem.shortName,
            number: sem.number,
            academicYear: sem.academicYear ?? '',
            isActive: sem.isActive,
        });
        setError(null);
        setShowAddModal(true);
    }

    async function handleToggleActive(sem: Semester) {
        const updated = await updateSemester({ ...sem, isActive: !sem.isActive });
        if (updated) {
            setSemesters(prev => prev.map(s => s.id === updated.id ? updated : s));
        }
    }

    async function handleSave() {
        if (!formData.programId || !formData.name.trim() || !formData.shortName.trim() || !formData.academicYear.trim()) {
            setError('All fields are required.');
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            if (editingSemester) {
                const updated = await updateSemester({ ...editingSemester, ...formData });
                if (updated) {
                    setSemesters(prev => prev.map(s => s.id === updated.id ? updated : s));
                } else {
                    setError('Failed to update semester.');
                    return;
                }
            } else {
                const created = await createSemester(formData);
                if (created) {
                    setSemesters(prev => [...prev, created]);
                } else {
                    setError('Failed to create semester.');
                    return;
                }
            }
            setShowAddModal(false);
        } catch (e) {
            console.error(e);
            setError('An unexpected error occurred.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(sem: Semester) {
        if (!confirm(`Delete semester "${sem.name}"? This cannot be undone.`)) return;
        const ok = await deleteSemester(sem.id);
        if (ok) {
            setSemesters(prev => prev.filter(s => s.id !== sem.id));
        } else {
            alert('Failed to delete semester.');
        }
    }

    const filtered = selectedProgramFilter === 'all'
        ? semesters
        : semesters.filter(s => s.programId === selectedProgramFilter);

    // Group by programId for display
    const grouped = programs.reduce<Record<string, { program: Program; semesters: Semester[] }>>((acc, prog) => {
        const sems = filtered.filter(s => s.programId === prog.id);
        if (selectedProgramFilter !== 'all' && prog.id !== selectedProgramFilter) return acc;
        acc[prog.id] = { program: prog, semesters: sems };
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header Row */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={selectedProgramFilter}
                            onChange={e => setSelectedProgramFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 rounded-xl pl-3.5 pr-9 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="all">All Programs</option>
                            {programs.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <Icons.ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-sm text-gray-400">
                        {isLoading ? 'Loading…' : `${filtered.length} semester${filtered.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    disabled={programs.length === 0}
                    className={cn(
                        "flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors",
                        programs.length === 0 ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                >
                    <Icons.Plus size={16} />
                    Add Semester
                </button>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-1/4" />
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map(j => (
                                    <div key={j} className="h-16 bg-gray-50 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Grouped Semesters */}
            {!isLoading && Object.values(grouped).map(({ program, semesters: semList }) => (
                <div key={program.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-500">{program.code}</span>
                        <span className="text-xs font-semibold text-gray-400">{program.name}</span>
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-300">{semList.length} semesters</span>
                    </div>

                    {semList.length === 0 ? (
                        <div className="bg-gray-50 rounded-2xl p-8 text-center">
                            <p className="text-gray-400 text-sm">No semesters for this program yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {semList.map(sem => (
                                <div
                                    key={sem.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-indigo-100 transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-black text-indigo-600 text-sm">{sem.shortName}</span>
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                                    sem.isActive
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {sem.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 font-semibold text-sm mt-0.5 truncate">{sem.name}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-xs text-gray-400">Sem {sem.number}</span>
                                                <span className="text-xs text-gray-300">•</span>
                                                <span className="text-xs text-gray-400">{sem.academicYear}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {/* Toggle Active */}
                                            <button
                                                onClick={() => handleToggleActive(sem)}
                                                className={cn(
                                                    "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
                                                    sem.isActive
                                                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                                )}
                                                title={sem.isActive ? "Deactivate" : "Activate"}
                                            >
                                                <Icons.Check size={13} />
                                            </button>
                                            <button
                                                onClick={() => openEdit(sem)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-colors"
                                                title="Edit"
                                            >
                                                <Icons.Edit size={13} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sem)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Icons.Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Empty State */}
            {!isLoading && programs.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Icons.BookOpen size={32} className="text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-700 font-semibold text-lg">No programs found</p>
                        <p className="text-gray-400 text-sm mt-1">Create a program first, then add semesters.</p>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                            <h2 className="text-lg font-black text-gray-900">
                                {editingSemester ? 'Edit Semester' : 'Add Semester'}
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
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Program *</label>
                                <div className="relative">
                                    <select
                                        value={formData.programId}
                                        onChange={e => setFormData(f => ({ ...f, programId: e.target.value }))}
                                        className="w-full appearance-none border border-gray-200 rounded-xl pl-3.5 pr-9 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {programs.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                                        ))}
                                    </select>
                                    <Icons.ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Semester 3 (Jul-Nov 2025)"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Short Name *</label>
                                    <input
                                        type="text"
                                        value={formData.shortName}
                                        onChange={e => setFormData(f => ({ ...f, shortName: e.target.value }))}
                                        placeholder="e.g. Sem 3"
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Number *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.number}
                                        onChange={e => setFormData(f => ({ ...f, number: parseInt(e.target.value) || 1 }))}
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Academic Year *</label>
                                <input
                                    type="text"
                                    value={formData.academicYear}
                                    onChange={e => setFormData(f => ({ ...f, academicYear: e.target.value }))}
                                    placeholder="e.g. 2025-26"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">Active Semester</p>
                                    <p className="text-xs text-gray-400">Visible to enrolled students</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(f => ({ ...f, isActive: !f.isActive }))}
                                    className={cn(
                                        "relative w-11 h-6 rounded-full transition-colors",
                                        formData.isActive ? "bg-indigo-600" : "bg-gray-200"
                                    )}
                                >
                                    <span className={cn(
                                        "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all",
                                        formData.isActive ? "left-5" : "left-0.5"
                                    )} />
                                </button>
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
                                {editingSemester ? 'Save Changes' : 'Create Semester'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
