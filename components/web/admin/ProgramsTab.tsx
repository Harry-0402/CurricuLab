'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import {
    getPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
} from '@/lib/services/semester-service';
import { Program } from '@/types';

interface FormData {
    name: string;
    code: string;
    description: string;
}

const defaultForm: FormData = { name: '', code: '', description: '' };

export function ProgramsTab() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [formData, setFormData] = useState<FormData>(defaultForm);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPrograms();
    }, []);

    async function loadPrograms() {
        setIsLoading(true);
        const data = await getPrograms();
        setPrograms(data);
        setIsLoading(false);
    }

    function openAdd() {
        setEditingProgram(null);
        setFormData(defaultForm);
        setError(null);
        setShowAddModal(true);
    }

    function openEdit(program: Program) {
        setEditingProgram(program);
        setFormData({ name: program.name, code: program.code, description: program.description ?? '' });
        setError(null);
        setShowAddModal(true);
    }

    async function handleSave() {
        if (!formData.name.trim() || !formData.code.trim()) {
            setError('Name and Code are required.');
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            if (editingProgram) {
                const updated = await updateProgram({ ...editingProgram, ...formData });
                if (updated) {
                    setPrograms(prev => prev.map(p => p.id === updated.id ? updated : p));
                } else {
                    setError('Failed to update program.');
                }
            } else {
                const created = await createProgram(formData);
                if (created) {
                    setPrograms(prev => [...prev, created]);
                } else {
                    setError('Failed to create program.');
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

    async function handleDelete(program: Program) {
        if (!confirm(`Delete program "${program.name}"? This cannot be undone.`)) return;
        const ok = await deleteProgram(program.id);
        if (ok) {
            setPrograms(prev => prev.filter(p => p.id !== program.id));
        } else {
            alert('Failed to delete program.');
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Row */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {isLoading ? 'Loading…' : `${programs.length} program${programs.length !== 1 ? 's' : ''} configured`}
                </p>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    <Icons.Plus size={16} />
                    Add Program
                </button>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && programs.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Icons.GraduationCap size={32} className="text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-700 font-semibold text-lg">No programs yet</p>
                        <p className="text-gray-400 text-sm mt-1">Create your first academic program to get started.</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                    >
                        Add First Program
                    </button>
                </div>
            )}

            {/* Programs List */}
            {!isLoading && programs.length > 0 && (
                <div className="space-y-3">
                    {programs.map(program => (
                        <div
                            key={program.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:border-indigo-100 transition-all group"
                        >
                            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icons.GraduationCap size={22} className="text-indigo-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-bold text-gray-900 text-sm">{program.name}</p>
                                    <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full tracking-widest uppercase">
                                        {program.code}
                                    </span>
                                </div>
                                {program.description && (
                                    <p className="text-gray-400 text-xs mt-0.5 truncate">{program.description}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEdit(program)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-colors"
                                    title="Edit"
                                >
                                    <Icons.Edit size={15} />
                                </button>
                                <button
                                    onClick={() => handleDelete(program)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                                    title="Delete"
                                >
                                    <Icons.Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                            <h2 className="text-lg font-black text-gray-900">
                                {editingProgram ? 'Edit Program' : 'Add Program'}
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                                <Icons.X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100">
                                    <Icons.AlertTriangle size={15} className="flex-shrink-0" />
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Program Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Master of Business Administration"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={e => setFormData(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                    placeholder="e.g. MBA"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Brief description of the program…"
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
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
                                {editingProgram ? 'Save Changes' : 'Create Program'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
