"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WebAppShell } from '@/components/web/WebAppShell';
import { UnitCard } from '@/components/web/UnitCard';
import { Subject, Unit } from '@/types';
import { SubjectService } from '@/lib/data/subject-service';
import { UnitService } from '@/lib/data/unit-service';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { useSemester } from '@/components/providers/SemesterProvider';
import { supabase } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/shared/Dialog";

interface SubtopicInput {
    id: string;
    title: string;
}

interface TopicInput {
    id: string;
    title: string;
    subtopics: SubtopicInput[];
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

export default function WebSubjectDetailContent() {
    const params = useParams();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);

    // Edit Unit Form State
    const [editingUnitTitle, setEditingUnitTitle] = useState('');
    const [editingUnitDescription, setEditingUnitDescription] = useState('');
    const [topicsList, setTopicsList] = useState<TopicInput[]>([]);
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [batchInput, setBatchInput] = useState('');

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const { activeSemesterId, setActiveSemester } = useSemester();
    const [isEditingSubject, setIsEditingSubject] = useState(false);
    const [subjectFormData, setSubjectFormData] = useState({
        code: '',
        title: '',
        description: '',
        unitCount: 5,
        color: '#4f46e5',
        icon: 'BookOpen',
        gcrKeyword: '',
        syllabusPdfUrl: '',
        syllabusFile: null as File | null,
    });
    const [isSavingSubject, setIsSavingSubject] = useState(false);
    const [subjectError, setSubjectError] = useState<string | null>(null);

    useEffect(() => {
        if (subject && subject.semesterId && subject.semesterId !== activeSemesterId) {
            setActiveSemester(subject.semesterId);
        }
    }, [subject, activeSemesterId, setActiveSemester]);

    useEffect(() => {
        const loadData = async () => {
            if (!params.subjectId) return;
            const subId = params.subjectId as string;

            setIsLoading(true);

            // Fetch Subject
            const subjectData = await SubjectService.getById(subId);
            setSubject(subjectData);

            if (subjectData) {
                // Fetch Units (this triggers auto-seeding if DB is empty)
                // Pass subject code to handle potential ID mismatches (e.g. PBA204 vs s1)
                const unitsData = await UnitService.getBySubjectId(subjectData.id, subjectData.code);
                setUnits(unitsData);
            }

            setIsLoading(false);
        };
        loadData();
    }, [params.subjectId]);

    // Light fallback generator just for truly missing subjects (s6-s8) where no static definition exists
    if (!isLoading && subject && units.length === 0) {
        // Only generate if we really have nothing
        for (let i = 1; i <= 5; i++) {
            units.push({
                id: `gen-${subject.id}-${i}`,
                subjectId: subject.id,
                title: `Unit ${i}: ${subject.title} Concepts`,
                description: "Core fundamental concepts and applications.",
                order: i,
                isCompleted: false,
                topics: ["Introduction", "Key Principles", "Case Studies", "Advanced Topics"]
            });
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

    const handleEditTopics = (unit: Unit) => {
        setEditingUnit(unit);
        setEditingUnitTitle(unit.title);
        setEditingUnitDescription(unit.description || '');
        setTopicsList(parseTopics(unit.topics || []));
        setIsBatchMode(false);
    };

    const handleViewTopics = (unit: Unit) => {
        setViewingUnit(unit);
        setTopicsList(parseTopics(unit.topics || []));
    };

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

    const handleEditSubject = () => {
        if (!subject) return;
        setSubjectFormData({
            code: subject.code,
            title: subject.title,
            description: subject.description ?? '',
            unitCount: subject.unitCount,
            color: subject.color,
            icon: subject.icon,
            gcrKeyword: subject.gcrKeyword ?? '',
            syllabusPdfUrl: subject.syllabusPdfUrl ?? '',
            syllabusFile: null,
        });
        setSubjectError(null);
        setIsEditingSubject(true);
    };

    const handleSaveSubject = async () => {
        if (!subject) return;
        if (!subjectFormData.code.trim() || !subjectFormData.title.trim()) {
            setSubjectError('Code and Title are required.');
            return;
        }

        setIsSavingSubject(true);
        setSubjectError(null);

        try {
            let finalPdfUrl = subjectFormData.syllabusPdfUrl;
            if (subjectFormData.syllabusFile) {
                const fileExt = subjectFormData.syllabusFile.name.split('.').pop();
                const fileName = `syllabuses/${crypto.randomUUID()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('library-assets')
                    .upload(fileName, subjectFormData.syllabusFile);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage
                    .from('library-assets')
                    .getPublicUrl(fileName);
                finalPdfUrl = publicUrl;
            }

            const updatedSubjectData: Subject = {
                ...subject,
                code: subjectFormData.code.toUpperCase(),
                title: subjectFormData.title,
                description: subjectFormData.description,
                unitCount: subjectFormData.unitCount,
                color: subjectFormData.color,
                gcrKeyword: subjectFormData.gcrKeyword,
                syllabusPdfUrl: finalPdfUrl || undefined,
            };

            await SubjectService.update(updatedSubjectData);
            setSubject(updatedSubjectData);
            setIsEditingSubject(false);
            toast.success('Subject updated successfully');
        } catch (e: any) {
            console.error(e);
            setSubjectError(e?.message ?? 'An unexpected error occurred.');
        } finally {
            setIsSavingSubject(false);
        }
    };

    const handleSaveUnit = async () => {
        if (!editingUnit || !editingUnitTitle.trim()) return;

        const updatedUnit = { 
            ...editingUnit, 
            title: editingUnitTitle,
            description: editingUnitDescription,
            topics: serializeTopics(topicsList) 
        };

        try {
            await UnitService.update(updatedUnit);

            // Update local state
            setUnits(prev => prev.map(u => u.id === editingUnit.id ? updatedUnit : u));
            setEditingUnit(null);
            toast.success('Unit saved successfully');
        } catch (error) {
            console.error("Failed to update unit", error);
            toast.error("Failed to save changes.");
        }
    };

    if (isLoading) {
        return (
            <WebAppShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </WebAppShell>
        );
    }

    if (!subject) return null;

    return (
        <WebAppShell>
            <div className="space-y-10">
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                    <div className="space-y-4 flex-1">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{subject.title}</h2>
                        <p className="text-lg font-bold text-gray-400 max-w-2xl leading-relaxed">{subject.description}</p>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-2 mt-2 rounded-xl bg-amber-50 border border-amber-100">
                            <Icons.Info size={14} className="text-amber-500 shrink-0" />
                            <p className="text-xs font-bold text-amber-700">
                                Note: The active semester is locked to this subject. To browse other semesters, return to the Courses page.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0 items-center">
                        <button
                            onClick={handleEditSubject}
                            className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 shrink-0"
                            title="Edit Subject"
                        >
                            <Icons.Edit size={20} />
                        </button>
                        {subject.syllabusPdfUrl && (
                            <div className="w-full sm:w-72 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Syllabus</span>
                                    <Icons.Download size={14} className="text-blue-600" />
                                </div>
                                <button
                                    onClick={() => setIsPreviewOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                >
                                    Preview Syllabus
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {units.map((unit) => (
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            onEditTopics={handleEditTopics}
                            onViewTopics={handleViewTopics}
                        />
                    ))}
                </div>

                {/* Edit Unit Modal */}
                <Dialog open={!!editingUnit} onOpenChange={(open) => !open && setEditingUnit(null)}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                        <div className="flex items-center justify-between pl-6 pr-20 py-4 border-b border-gray-100 shrink-0">
                            <div>
                                <DialogTitle>Edit Unit</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Manage title, description, and topics.
                                </DialogDescription>
                            </div>
                            {isBatchMode ? (
                                <button onClick={() => setIsBatchMode(false)} className="text-xs font-bold text-gray-500 hover:text-gray-700">Cancel Batch</button>
                            ) : (
                                <button onClick={openBatchMode} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                    <Icons.FileText size={12} /> Batch Upload
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                                <input
                                    type="text"
                                    value={editingUnitTitle}
                                    onChange={e => setEditingUnitTitle(e.target.value)}
                                    placeholder="Unit I: Basics"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea
                                    value={editingUnitDescription}
                                    onChange={e => setEditingUnitDescription(e.target.value)}
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

                        <DialogFooter className="p-4 border-t border-gray-100 shrink-0">
                            <button
                                onClick={() => setEditingUnit(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUnit}
                                disabled={!editingUnitTitle.trim()}
                                className="px-6 py-2 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-indigo-300 disabled:shadow-none"
                            >
                                Save Changes
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Topics Modal */}
                <Dialog open={!!viewingUnit} onOpenChange={(open) => !open && setViewingUnit(null)}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Unit Topics</DialogTitle>
                            <DialogDescription>
                                Full syllabus coverage for <strong>{viewingUnit?.title}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                {topicsList.length === 0 ? (
                                    <p className="text-center text-gray-400 text-sm py-4">No topics listed.</p>
                                ) : (
                                    topicsList.map((topic, index) => (
                                        <div key={topic.id} className="flex flex-col gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                                <span className="text-sm font-medium text-gray-700 leading-relaxed">{topic.title}</span>
                                            </div>
                                            {topic.subtopics.length > 0 && (
                                                <ul className="pl-6 space-y-1.5 mt-1 border-l-2 border-indigo-100 ml-0.5">
                                                    {topic.subtopics.map((sub, j) => (
                                                        <li key={sub.id} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                                                            <span className="shrink-0 mt-0.5">-</span>
                                                            <span className="leading-relaxed">{sub.title}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <button
                                onClick={() => {
                                    setViewingUnit(null);
                                    if (viewingUnit) handleEditTopics(viewingUnit);
                                }}
                                className="mr-auto px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            >
                                <Icons.Edit className="inline mr-2 h-3 w-3" />
                                Edit Unit
                            </button>
                            <button
                                onClick={() => setViewingUnit(null)}
                                className="px-6 py-2 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* Preview Modal */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10 shrink-0">
                            <div>
                                <DialogTitle className="text-xl font-black text-gray-900">Syllabus Preview</DialogTitle>
                                <DialogDescription className="text-xs font-bold text-gray-500 mt-1">
                                    {subject?.title}
                                </DialogDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={subject?.syllabusPdfUrl || '#'}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 text-xs font-bold"
                                    title="Download Syllabus"
                                >
                                    <Icons.Download size={16} />
                                    <span className="hidden sm:inline">Download</span>
                                </a>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <Icons.X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 w-full bg-gray-100 overflow-hidden relative">
                            {subject?.syllabusPdfUrl ? (
                                <iframe
                                    src={subject.syllabusPdfUrl}
                                    className="w-full h-full border-0 absolute inset-0"
                                    title="Syllabus Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 font-bold">
                                    No syllabus file available for preview.
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Edit Subject Modal */}
                {isEditingSubject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white">
                                <h2 className="text-lg font-black text-gray-900">
                                    Edit Subject
                                </h2>
                                <button
                                    onClick={() => setIsEditingSubject(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                                >
                                    <Icons.X size={18} />
                                </button>
                            </div>

                            <div className="px-6 py-5 space-y-4">
                                {subjectError && (
                                    <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100">
                                        <Icons.AlertTriangle size={15} className="flex-shrink-0" />
                                        {subjectError}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Code *</label>
                                        <input
                                            type="text"
                                            value={subjectFormData.code}
                                            onChange={e => setSubjectFormData(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                            placeholder="e.g. PBA201"
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Unit Count</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={subjectFormData.unitCount}
                                            onChange={e => setSubjectFormData(f => ({ ...f, unitCount: parseInt(e.target.value) || 5 }))}
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                                    <input
                                        type="text"
                                        value={subjectFormData.title}
                                        onChange={e => setSubjectFormData(f => ({ ...f, title: e.target.value }))}
                                        placeholder="e.g. Production and Operations Management"
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea
                                        value={subjectFormData.description}
                                        onChange={e => setSubjectFormData(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Brief description of the subject…"
                                        rows={2}
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Google Classroom Keyword</label>
                                    <input
                                        type="text"
                                        value={subjectFormData.gcrKeyword}
                                        onChange={e => setSubjectFormData(f => ({ ...f, gcrKeyword: e.target.value }))}
                                        placeholder="e.g. PBA211 or Python"
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Syllabus File (PDF/Word)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={e => setSubjectFormData(f => ({ ...f, syllabusFile: e.target.files?.[0] || null }))}
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {subjectFormData.syllabusPdfUrl && !subjectFormData.syllabusFile && (
                                        <p className="text-xs text-indigo-600 mt-1 font-semibold">
                                            <a href={subjectFormData.syllabusPdfUrl} target="_blank" rel="noreferrer" className="hover:underline">Current Syllabus Uploaded</a>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {COLOR_OPTIONS.map(c => (
                                            <button
                                                key={c.value}
                                                type="button"
                                                onClick={() => setSubjectFormData(f => ({ ...f, color: c.value }))}
                                                className={cn(
                                                    "w-8 h-8 rounded-lg transition-all",
                                                    subjectFormData.color === c.value ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-105"
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
                                    onClick={() => setIsEditingSubject(false)}
                                    className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveSubject}
                                    disabled={isSavingSubject}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors",
                                        isSavingSubject ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                                    )}
                                >
                                    {isSavingSubject ? <Icons.Loader2 size={15} className="animate-spin" /> : <Icons.Save size={15} />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </WebAppShell>
    );
}
