'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { UnitService } from '@/lib/data/unit-service';
import { Unit } from '@/types';
import { cn } from '@/lib/utils';

interface SubjectUnitsModalProps {
    subjectId: string;
    subjectTitle: string;
    onClose: () => void;
}

export function SubjectUnitsModal({ subjectId, subjectTitle, onClose }: SubjectUnitsModalProps) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state for adding/editing a unit
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [topicsInput, setTopicsInput] = useState('');

    useEffect(() => {
        loadUnits();
    }, [subjectId]);

    async function loadUnits() {
        setIsLoading(true);
        setError(null);
        try {
            // We pass '' for subject code just to fetch existing units or trigger seed
            const data = await UnitService.getBySubjectId(subjectId, '');
            setUnits(data);
        } catch (e: any) {
            setError('Failed to load units: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleEdit(unit: Unit) {
        setEditingUnit(unit);
        setTitle(unit.title);
        setDescription(unit.description);
        setTopicsInput(unit.topics ? unit.topics.join('\n') : '');
    }

    function handleAdd() {
        setEditingUnit(null);
        setTitle(`Unit ${units.length + 1}: `);
        setDescription('');
        setTopicsInput('');
    }

    function cancelEdit() {
        setEditingUnit(null);
        setTitle('');
        setDescription('');
        setTopicsInput('');
    }

    async function handleSave() {
        if (!title.trim()) return;

        setIsSaving(true);
        setError(null);
        try {
            const topics = topicsInput
                .split('\n')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            if (editingUnit) {
                await UnitService.update({
                    ...editingUnit,
                    title,
                    description,
                    topics
                });
            } else {
                await UnitService.create({
                    subjectId,
                    title,
                    description,
                    order: units.length + 1,
                    isCompleted: false,
                    topics
                });
            }
            cancelEdit();
            await loadUnits();
        } catch (e: any) {
            setError('Failed to save unit: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(unitId: string) {
        if (!confirm('Are you sure you want to delete this unit?')) return;
        setIsLoading(true);
        try {
            await UnitService.delete(unitId);
            await loadUnits();
        } catch (e: any) {
            setError('Failed to delete unit: ' + e.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Manage Units</h2>
                        <p className="text-sm font-semibold text-gray-500 mt-0.5">{subjectTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                        <Icons.X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 flex gap-6">
                    {/* Left: List of Units */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900">Current Units ({units.length})</h3>
                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                <Icons.Plus size={16} /> Add Unit
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        {isLoading && units.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                                <Icons.Loader2 className="animate-spin mb-2" size={24} />
                                Loading units...
                            </div>
                        ) : units.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-semibold text-sm">No units found.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {units.map((unit, index) => (
                                    <div key={unit.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:border-indigo-200 transition-colors group relative">
                                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Unit {index + 1}</span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-sm leading-snug">{unit.title}</h4>
                                                {unit.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{unit.description}</p>}
                                                <div className="mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {unit.topics?.length || 0} topics
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <button
                                                    onClick={() => handleEdit(unit)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                                                    title="Edit Unit"
                                                >
                                                    <Icons.Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(unit.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                    title="Delete Unit"
                                                >
                                                    <Icons.Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Edit/Add Form */}
                    <div className="w-80 shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-0 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                                {editingUnit ? 'Edit Unit' : 'Add New Unit'}
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Unit I: Basics"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Overview of the unit..."
                                        rows={3}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Topics (One per line)</label>
                                    <textarea
                                        value={topicsInput}
                                        onChange={e => setTopicsInput(e.target.value)}
                                        placeholder="Topic 1\nTopic 2\nTopic 3"
                                        rows={8}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-xs leading-relaxed"
                                    />
                                </div>

                                <div className="pt-2 flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || !title.trim()}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-indigo-300"
                                    >
                                        {isSaving && <Icons.Loader2 size={14} className="animate-spin" />}
                                        Save Unit
                                    </button>
                                    {editingUnit && (
                                        <button
                                            onClick={cancelEdit}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
