"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Subject, Assignment, Unit } from '@/types';
import { getSubjects, getAssignments, createAssignment, updateAssignment, deleteAssignment, getUnits } from '@/lib/services/app.service';
import { AiService } from '@/lib/services/ai-service';

import { AssignmentModal } from './AssignmentModal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/shared/Dialog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AssignmentContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

    // Detail Modal State
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

    // Delete Confirmation State
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);





    useEffect(() => {
        const loadData = async () => {
            const fetchedSubjects = await getSubjects();
            setSubjects(fetchedSubjects);
            if (fetchedSubjects.length > 0) {
                // Restore active subject from storage or default to first
                const storedSubjectId = localStorage.getItem('activeSubjectId');
                const validSubject = fetchedSubjects.find(s => s.id === storedSubjectId);
                setActiveSubjectId(validSubject ? validSubject.id : fetchedSubjects[0].id);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const loadAssignments = async () => {
            if (activeSubjectId) {
                setLoading(true);
                localStorage.setItem('activeSubjectId', activeSubjectId); // Persist subject selection logic

                const [fetched, fetchedUnits] = await Promise.all([
                    getAssignments(activeSubjectId),
                    getUnits(activeSubjectId)
                ]);
                setAssignments(fetched);
                setUnits(fetchedUnits);

                // Restore Modal State if applicable
                const storedAssignmentId = localStorage.getItem('openAssignmentId');
                if (storedAssignmentId && !selectedAssignment) {
                    const restoredAssignment = fetched.find(a => a.id === storedAssignmentId);
                    if (restoredAssignment) {
                        setSelectedAssignment(restoredAssignment);
                    }
                }

                setLoading(false);
            }
        };
        loadAssignments();
    }, [activeSubjectId]);

    const activeSubject = subjects.find(s => s.id === activeSubjectId);

    const handleSaveAssignment = async (data: Partial<Assignment>) => {
        try {
            if (editingAssignment) {
                // Update
                const updated = await updateAssignment({ ...editingAssignment, ...data } as Assignment);
                if (updated.subjectId === activeSubjectId) {
                    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
                } else {
                    // Moved to another subject, remove from current view
                    setAssignments(prev => prev.filter(a => a.id !== updated.id));
                }
            } else {
                // Create
                const newAssignment = await createAssignment({
                    id: crypto.randomUUID(),
                    title: data.title || 'Untitled',
                    description: data.description || '',
                    questions: data.questions || [],
                    subjectId: data.subjectId || activeSubjectId!, // Use selected subject!
                    dueDate: data.dueDate || new Date().toISOString().split('T')[0],
                    unitId: data.unitId || undefined,
                    platform: data.platform
                } as Assignment);

                if (newAssignment.subjectId === activeSubjectId) {
                    setAssignments(prev => [...prev, newAssignment]);
                }
            }
        } catch (error) {
            console.error("Failed to save assignment:", error);
            // Optionally add toast notification here
        }
        setEditingAssignment(null);
    };

    const handleDeleteAssignment = async (id: string) => {
        try {
            await deleteAssignment(id);
            setAssignments(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete assignment:", error);
        }
    };

    const openEditModal = (assignment: Assignment) => {
        setEditingAssignment(assignment);
        setIsModalOpen(true);
    };

    const openDetailModal = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        localStorage.setItem('openAssignmentId', assignment.id); // Persist open state
    };

    const handleGenerateAnswer = async (questionIndex: number) => {
        if (!selectedAssignment || !selectedAssignment.questions[questionIndex]) return;

        const question = selectedAssignment.questions[questionIndex];
        setIsGeneratingAnswer(true);

        try {
            const subject = subjects.find(s => s.id === selectedAssignment.subjectId);
            const unit = selectedAssignment.unitId ? units.find(u => u.id === selectedAssignment.unitId) : null;
            const topicsContext = unit?.topics?.length ? `\nRelevant Topics: ${unit.topics.join(', ')}` : '';

            const prompt = `You are a university professor providing a comprehensive answer to a specific assignment question.

Subject: ${subject?.title || 'Business Administration'}
${unit ? `Unit: ${unit.title}` : ''}
${topicsContext}

Assignment Title: ${selectedAssignment.title}
Question: ${question.text}

Provide a detailed, well-structured answer that:
1. MUST use Heading 2 (##) for the Question Title
2. MUST use Heading 3 (###) for major sections (Introduction, Analysis, etc.)
3. Includes relevant examples and practical applications
4. Uses **bold** for key terms
5. Uses bullet points (-) for listing features or steps
6. Adds a comparison table if applicable
7. Ends with a brief summary
8. Keep paragraphs concise and scannable

Format the response in clean, readable markdown.`;

            const answer = await AiService.generateContent(prompt);

            // Update local state
            const updatedQuestions = [...selectedAssignment.questions];
            updatedQuestions[questionIndex] = { ...question, answer };
            const updatedAssignment = { ...selectedAssignment, questions: updatedQuestions };

            // Persist to DB
            const savedAssignment = await updateAssignment(updatedAssignment);

            // Update lists
            setSelectedAssignment(savedAssignment);
            setAssignments(prev => prev.map(a => a.id === savedAssignment.id ? savedAssignment : a));

        } catch (error: any) {
            console.error('Failed to generate answer:', error);
            // Optionally show error in UI
        } finally {
            setIsGeneratingAnswer(false);
        }
    };

    const handleExportWord = async () => {
        if (!selectedAssignment || selectedAssignment.questions.length === 0) return;
        const subject = subjects.find(s => s.id === selectedAssignment.subjectId);
        const unit = units.find(u => u.id === selectedAssignment.unitId);

        const { PlatformExportService } = await import('@/lib/services/export-service');
        const sections = selectedAssignment.questions.map((q, idx) => ({
            id: q.id,
            title: `Question ${idx + 1}: ${q.text.substring(0, 50)}${q.text.length > 50 ? '...' : ''}`,
            content: q.answer || 'No answer generated.'
        }));

        await PlatformExportService.generateWordDocument(
            subject?.title || 'Assignment',
            unit?.title || selectedAssignment.title,
            sections
        );
    };

    const handleExportHTML = async () => {
        if (!selectedAssignment || selectedAssignment.questions.length === 0) return;
        const subject = subjects.find(s => s.id === selectedAssignment.subjectId);

        const combinedAnswers = selectedAssignment.questions
            .map((q, idx) => `## Question ${idx + 1}\n${q.text}\n\n### Answer\n${q.answer || 'No answer generated.'}`)
            .join('\n\n---\n\n');

        const { PlatformExportService } = await import('@/lib/services/export-service');
        await PlatformExportService.generateAssignmentHTMLExport(
            subject?.title || 'Assignment',
            selectedAssignment,
            combinedAnswers
        );
    };

    if (loading && subjects.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Area */}
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Academic</h1>
                    <p className="text-5xl font-black text-gray-900 tracking-tight">Assignments</p>
                </div>
                <button
                    onClick={() => { setEditingAssignment(null); setIsModalOpen(true); }}
                    className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Icons.Plus size={18} />
                    <span>New Assignment</span>
                </button>
            </div>

            {/* Subject Switcher - Consistent with Vault */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {subjects.map((subject) => {
                    const isActive = activeSubjectId === subject.id;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => setActiveSubjectId(subject.id)}
                            className={cn(
                                "px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1.5 border shadow-sm",
                                isActive
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                            )}
                        >
                            <span className="text-[10px] font-black tracking-widest uppercase">
                                {subject.code}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 bg-white rounded-full shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                    <div
                        key={assignment.id}
                        onClick={() => openDetailModal(assignment)}
                        className="group bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden cursor-pointer"
                    >

                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors duration-500">
                                    <Icons.Calendar size={22} />
                                </div>
                                {/* Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {assignment.unitId && (() => {
                                        const unitIndex = units.findIndex(u => u.id === assignment.unitId);
                                        return (
                                            <span className="h-12 px-4 bg-purple-100 text-purple-700 rounded-2xl text-xs font-bold flex items-center justify-center">
                                                Unit {unitIndex + 1}
                                            </span>
                                        );
                                    })()}
                                    {assignment.platform && (
                                        <span className="h-12 px-4 bg-blue-100 text-blue-700 rounded-2xl text-xs font-bold flex items-center justify-center">
                                            {assignment.platform}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-black text-gray-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                                    {assignment.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                    <Icons.List size={14} className="text-gray-300" />
                                    <span>{assignment.questions.length} Questions</span>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Due Date</span>
                                    <span className="text-sm font-black text-gray-900">{assignment.dueDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openEditModal(assignment); }}
                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                                    >
                                        <Icons.Edit size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(assignment.id); }}
                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                    >
                                        <Icons.Delete size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}


            </div>

            <AssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAssignment}
                assignment={editingAssignment}
                subjects={subjects}
            />

            {/* Detail Modal with AI Answer */}
            <Dialog
                open={!!selectedAssignment}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedAssignment(null);
                        // Clear storage on close
                        localStorage.removeItem('openAssignmentId');
                        localStorage.removeItem('aiAnswerCache');
                    }
                }}
            >
                <DialogContent className="sm:max-w-5xl max-w-[95vw] h-[85vh] flex flex-col overflow-hidden border-0 bg-white shadow-2xl rounded-3xl p-0 gap-0">
                    {selectedAssignment && (
                        <div className="flex flex-col h-full">
                            {/* Header Section */}
                            <div className="p-8 pb-4 shrink-0">
                                <DialogHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <DialogTitle className="text-2xl font-black text-gray-900 pr-8">
                                                {selectedAssignment.title}
                                            </DialogTitle>
                                            <DialogDescription asChild>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                                                        <Icons.Calendar size={14} />
                                                        <span>Due: {selectedAssignment.dueDate}</span>
                                                        {selectedAssignment.unitId && (() => {
                                                            const unitIndex = units.findIndex(u => u.id === selectedAssignment.unitId);
                                                            return (
                                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                                                    Unit {unitIndex + 1}
                                                                </span>
                                                            );
                                                        })()}
                                                        {selectedAssignment.platform && (
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                                {selectedAssignment.platform}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogDescription>
                                        </div>

                                        {selectedAssignment.externalLink && selectedAssignment.platform === 'GCR' && (
                                            <a
                                                href={selectedAssignment.externalLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 shrink-0 mr-12"
                                            >
                                                <Icons.Google size={14} />
                                                Open in Classroom
                                            </a>
                                        )}
                                    </div>
                                </DialogHeader>
                            </div>

                            {/* Questions Section */}
                            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                                <div className="space-y-8">
                                    {selectedAssignment.description && (
                                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Instructions / Notes</h4>
                                            <p className="text-gray-700 font-medium leading-relaxed text-sm">
                                                {selectedAssignment.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Questions & Answers</h4>
                                        {selectedAssignment.questions.length === 0 && (
                                            <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                                <p className="text-sm font-bold text-gray-400">No questions added to this assignment.</p>
                                            </div>
                                        )}
                                        {selectedAssignment.questions.map((q, idx) => (
                                            <div key={q.id} className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm space-y-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 shrink-0 mt-1">
                                                            {idx + 1}
                                                        </div>
                                                        <p className="text-gray-900 font-bold text-base leading-snug pt-1">
                                                            {q.text}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleGenerateAnswer(idx)}
                                                        disabled={isGeneratingAnswer}
                                                        className={cn(
                                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm shrink-0",
                                                            isGeneratingAnswer
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:scale-[1.02]"
                                                        )}
                                                    >
                                                        {isGeneratingAnswer ? (
                                                            <><Icons.Loader2 size={12} className="animate-spin" /> Generating...</>
                                                        ) : (
                                                            <><Icons.Sparkles size={12} /> {q.answer ? 'Regenerate' : 'Generate Answer'}</>
                                                        )}
                                                    </button>
                                                </div>

                                                {q.answer ? (
                                                    <div className="bg-gray-50 rounded-2xl p-6 prose prose-sm max-w-none border border-gray-100">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                h1: ({ ...props }) => <h1 className="text-xl font-black text-gray-900 mt-4 mb-3" {...props} />,
                                                                h2: ({ ...props }) => <h2 className="text-lg font-black text-gray-900 mt-4 mb-3 border-b border-gray-200 pb-1" {...props} />,
                                                                h3: ({ ...props }) => <h3 className="text-md font-bold text-gray-800 mt-3 mb-2" {...props} />,
                                                                p: ({ ...props }) => <p className="text-gray-700 leading-relaxed mb-3 text-sm" {...props} />,
                                                                ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-sm text-gray-700" {...props} />,
                                                                ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm text-gray-700" {...props} />,
                                                                table: ({ ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full text-xs text-left border-collapse border border-gray-200" {...props} /></div>,
                                                                th: ({ ...props }) => <th className="px-3 py-2 bg-gray-100 border border-gray-200 font-bold" {...props} />,
                                                                td: ({ ...props }) => <td className="px-3 py-2 border border-gray-100" {...props} />,
                                                            }}
                                                        >
                                                            {q.answer}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <div className="py-4 px-6 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-3">
                                                        <Icons.Sparkles size={14} className="text-gray-300" />
                                                        <span className="text-xs font-bold text-gray-300">Click generate to get AI assistance for this question</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Due Date Alert Popup */}

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                                <Icons.Delete size={24} />
                            </div>
                            Delete Assignment
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium pt-2">
                            Are you sure you want to delete &quot;{assignments.find(a => a.id === deleteConfirmId)?.title}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (deleteConfirmId) {
                                    handleDeleteAssignment(deleteConfirmId);
                                    setDeleteConfirmId(null);
                                }
                            }}
                            className="px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                        >
                            Delete
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

        </div >
    );
}

