'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { UnitService } from '@/lib/data/unit-service';
import { Unit } from '@/types';
import { cn } from '@/lib/utils';

interface SubjectUnitsModalProps {
    subjectId: string;
    subjectCode: string;
    subjectTitle: string;
    onClose: () => void;
}

interface SubtopicInput {
    id: string;
    title: string;
}

interface TopicInput {
    id: string;
    title: string;
    subtopics: SubtopicInput[];
}

export function SubjectUnitsModal({ subjectId, subjectCode, subjectTitle, onClose }: SubjectUnitsModalProps) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state for adding/editing a unit
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // Topics State
    const [topicsList, setTopicsList] = useState<TopicInput[]>([]);
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [batchInput, setBatchInput] = useState('');

    useEffect(() => {
        loadUnits();
    }, [subjectId]);

    async function loadUnits() {
        setIsLoading(true);
        setError(null);
        try {
            const data = await UnitService.getBySubjectId(subjectId, subjectCode);
            setUnits(data);
        } catch (e: any) {
            setError('Failed to load units: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    }

    function parseTopics(rawTopics: string[]): TopicInput[] {
        const list: TopicInput[] = [];
        for (const t of rawTopics) {
            if (/^[ \t]+-/.test(t)) {
                if (list.length > 0) {
                    list[list.length - 1].subtopics.push({
                        id: Math.random().toString(36).substr(2, 9),
                        title: t.replace(/^[ \t]+-[ \t]*/, '')
                    });
                }
            } else {
                const title = t.replace(/^-[ \t]*/, '');
                list.push({ 
                    id: Math.random().toString(36).substr(2, 9), 
                    title, 
                    subtopics: [] 
                });
            }
        }
        return list;
    }

    function serializeTopics(list: TopicInput[]): string[] {
        const result: string[] = [];
        for (const topic of list) {
            if (!topic.title.trim()) continue;
            result.push(`- ${topic.title.trim()}`);
            for (const sub of topic.subtopics) {
                if (sub.title.trim()) {
                    result.push(`  - ${sub.title.trim()}`);
                }
            }
        }
        return result;
    }

    function handleEdit(unit: Unit) {
        setEditingUnit(unit);
        setTitle(unit.title);
        setDescription(unit.description);
        setTopicsList(parseTopics(unit.topics || []));
        setIsBatchMode(false);
    }

    function handleAdd() {
        setEditingUnit(null);
        setTitle(`Unit ${units.length + 1}: `);
        setDescription('');
        setTopicsList([]);
        setIsBatchMode(false);
    }

    function cancelEdit() {
        setEditingUnit(null);
        setTitle('');
        setDescription('');
        setTopicsList([]);
        setIsBatchMode(false);
    }

    async function handleSave() {
        if (!title.trim()) return;

        setIsSaving(true);
        setError(null);
        try {
            const topicsToSave = serializeTopics(topicsList);

            if (editingUnit) {
                await UnitService.update({
                    ...editingUnit,
                    title,
                    description,
                    topics: topicsToSave
                });
            } else {
                await UnitService.create({
                    subjectId,
                    title,
                    description,
                    order: units.length + 1,
                    isCompleted: false,
                    topics: topicsToSave
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

    function handleAddTopic() {
        setTopicsList([...topicsList, { id: Math.random().toString(36).substr(2, 9), title: '', subtopics: [] }]);
    }

    function handleUpdateTopic(index: number, val: string) {
        const updated = [...topicsList];
        updated[index].title = val;
        setTopicsList(updated);
    }

    function handleRemoveTopic(index: number) {
        const updated = [...topicsList];
        updated.splice(index, 1);
        setTopicsList(updated);
    }

    function handleAddSubtopic(topicIndex: number) {
        const updated = [...topicsList];
        updated[topicIndex].subtopics.push({ id: Math.random().toString(36).substr(2, 9), title: '' });
        setTopicsList(updated);
    }

    function handleUpdateSubtopic(topicIndex: number, subIndex: number, val: string) {
        const updated = [...topicsList];
        updated[topicIndex].subtopics[subIndex].title = val;
        setTopicsList(updated);
    }

    function handleRemoveSubtopic(topicIndex: number, subIndex: number) {
        const updated = [...topicsList];
        updated[topicIndex].subtopics.splice(subIndex, 1);
        setTopicsList(updated);
    }

    function openBatchMode() {
        setBatchInput(serializeTopics(topicsList).join('\n'));
        setIsBatchMode(true);
    }

    function handleApplyBatch() {
        const lines = batchInput.split('\n').filter(l => l.trim() !== '');
        setTopicsList(parseTopics(lines));
        setIsBatchMode(false);
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
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

                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6">
                    {/* Left: List of Units */}
                    <div className="flex-1 space-y-4 order-2 lg:order-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900">Current Units ({units.length})</h3>
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
                                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Unit {index + 1}</span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-sm leading-snug">{unit.title}</h4>
                                                {unit.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{unit.description}</p>}
                                                <div className="mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                    {parseTopics(unit.topics || []).length} topics
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-2 border-t border-gray-50 md:border-t-0 md:pt-0">
                                                <button
                                                    onClick={() => handleEdit(unit)}
                                                    className="w-full md:w-8 h-8 flex items-center justify-center gap-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors text-xs font-semibold"
                                                    title="Edit Unit"
                                                >
                                                    <Icons.Edit size={14} /> <span className="md:hidden">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(unit.id)}
                                                    className="w-full md:w-8 h-8 flex items-center justify-center gap-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors text-xs font-semibold"
                                                    title="Delete Unit"
                                                >
                                                    <Icons.Trash2 size={14} /> <span className="md:hidden">Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Edit/Add Form */}
                    <div className="w-full lg:w-96 shrink-0 flex flex-col lg:max-h-full order-1 lg:order-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col h-full lg:max-h-full overflow-hidden">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 shrink-0">
                                <h3 className="font-bold text-gray-900">
                                    {editingUnit ? 'Edit Unit' : 'Add New Unit'}
                                </h3>
                                {isBatchMode ? (
                                    <button onClick={() => setIsBatchMode(false)} className="text-xs font-bold text-gray-500 hover:text-gray-700">Cancel Batch</button>
                                ) : (
                                    <button onClick={openBatchMode} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                        <Icons.FileText size={12} /> Batch Upload
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-2">
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
                                        rows={2}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>

                                {isBatchMode ? (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Markdown Topics</label>
                                        <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">
                                            Paste topics in markdown format. Use <code className="bg-gray-100 px-1 rounded">- Topic</code> for main topics and <code className="bg-gray-100 px-1 rounded">  - Subtopic</code> for subtopics.
                                        </p>
                                        <textarea
                                            value={batchInput}
                                            onChange={e => setBatchInput(e.target.value)}
                                            placeholder="- Main Topic\n  - Subtopic 1\n  - Subtopic 2"
                                            rows={12}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-xs leading-relaxed"
                                        />
                                        <button
                                            onClick={handleApplyBatch}
                                            className="mt-2 w-full bg-gray-900 hover:bg-black text-white text-xs font-bold py-2 rounded-lg transition-colors"
                                        >
                                            Apply Markdown
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Topics</label>
                                            <button onClick={handleAddTopic} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                                <Icons.Plus size={12} /> Add Topic
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {topicsList.length === 0 && (
                                                <div className="text-center py-4 border border-dashed border-gray-200 rounded-xl">
                                                    <p className="text-xs text-gray-400 font-medium">No topics added.</p>
                                                </div>
                                            )}
                                            {topicsList.map((topic, tIndex) => (
                                                <div key={topic.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                                                    <div className="flex items-start gap-2 mb-2">
                                                        <div className="mt-1.5 flex-shrink-0 text-gray-400">
                                                            <Icons.GripVertical size={14} />
                                                        </div>
                                                        <input 
                                                            type="text"
                                                            value={topic.title}
                                                            onChange={e => handleUpdateTopic(tIndex, e.target.value)}
                                                            placeholder="Main Topic"
                                                            className="flex-1 bg-white border border-gray-200 rounded-md px-2 py-1 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        />
                                                        <button onClick={() => handleRemoveTopic(tIndex)} className="mt-1 p-1 text-gray-400 hover:text-red-500 transition-colors">
                                                            <Icons.Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Subtopics */}
                                                    <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-3">
                                                        {topic.subtopics.map((sub, sIndex) => (
                                                            <div key={sub.id} className="flex items-start gap-2">
                                                                <input 
                                                                    type="text"
                                                                    value={sub.title}
                                                                    onChange={e => handleUpdateSubtopic(tIndex, sIndex, e.target.value)}
                                                                    placeholder="Subtopic"
                                                                    className="flex-1 bg-white border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                                />
                                                                <button onClick={() => handleRemoveSubtopic(tIndex, sIndex)} className="mt-1 p-1 text-gray-400 hover:text-red-500 transition-colors">
                                                                    <Icons.X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => handleAddSubtopic(tIndex)} className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-wider py-1">
                                                            <Icons.Plus size={10} /> Add Subtopic
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex gap-2 shrink-0">
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
    );
}
