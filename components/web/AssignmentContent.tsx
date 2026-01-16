"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Subject, Assignment, Unit } from '@/types';
import { getSubjects, getAssignments, createAssignment, updateAssignment, deleteAssignment, getUnits } from '@/lib/services/app.service';
import { AiService } from '@/lib/services/ai-service';
import { PlatformExportService } from '@/lib/services/export-service';
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
    const [aiAnswer, setAiAnswer] = useState<string>('');
    const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const fetchedSubjects = await getSubjects();
            setSubjects(fetchedSubjects);
            if (fetchedSubjects.length > 0) {
                setActiveSubjectId(fetchedSubjects[0].id);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const loadAssignments = async () => {
            if (activeSubjectId) {
                setLoading(true);
                const [fetched, fetchedUnits] = await Promise.all([
                    getAssignments(activeSubjectId),
                    getUnits(activeSubjectId)
                ]);
                setAssignments(fetched);
                setUnits(fetchedUnits);
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
                    id: crypto.randomUUID(), // Temp ID, or let DB handle it? Supabase usually wants ID if providing, or we omit. Service mapAssignment expects ID. Service createAssignment inserts payload. Let's look at service. Service maps input ID.
                    title: data.title || 'Untitled',
                    description: data.description || '',
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
        setAiAnswer('');
    };

    const handleGenerateAnswer = async () => {
        if (!selectedAssignment) return;
        setIsGeneratingAnswer(true);
        setAiAnswer('');
        try {
            const subject = subjects.find(s => s.id === selectedAssignment.subjectId);
            const unit = selectedAssignment.unitId ? units.find(u => u.id === selectedAssignment.unitId) : null;
            const topicsContext = unit?.topics?.length ? `\nRelevant Topics: ${unit.topics.join(', ')}` : '';

            const prompt = `You are a university professor providing a comprehensive answer to a student's assignment.

Subject: ${subject?.title || 'Business Administration'}
${unit ? `Unit: ${unit.title}` : ''}
${topicsContext}

Assignment Question: ${selectedAssignment.title}
${selectedAssignment.description ? `Additional Context: ${selectedAssignment.description}` : ''}

Provide a detailed, well-structured answer that:
1. MUST use a main Heading 1 (#) for the Title of the Answer
2. MUST use Heading 2 (##) for major sections (Introduction, Key Concepts, etc.) and Heading 3 (###) for subsections
3. Includes relevant examples and practical applications
4. Uses **bold** for key terms and definitions
5. Uses bullet points (-) for listing features, characteristics, or steps
6. Adds a comparison table if comparing concepts (use markdown tables)
7. Ends with a brief conclusion or summary (under a ## Conclusion heading)
8. Keep paragraphs concise and scannable

Format the response in clean, readable markdown.`;

            const answer = await AiService.generateContent(prompt);
            setAiAnswer(answer);
        } catch (error: any) {
            console.error('Failed to generate answer:', error);
            setAiAnswer(`Error: ${error.message || 'Failed to generate answer. Please try again.'}`);
        } finally {
            setIsGeneratingAnswer(false);
        }
    };

    const handleExportWord = async () => {
        if (!selectedAssignment || !aiAnswer) return;
        const subject = subjects.find(s => s.id === selectedAssignment.subjectId);
        const unit = selectedAssignment.unitId ? units.find(u => u.id === selectedAssignment.unitId) : null;

        await PlatformExportService.generateWordDocument(
            subject?.title || 'Assignment',
            unit?.title || selectedAssignment.title,
            [{ id: selectedAssignment.id, title: selectedAssignment.title, content: aiAnswer }]
        );
        setShowExportMenu(false);
    };

    const handlePrint = () => {
        window.print();
        setShowExportMenu(false);
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
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Tasks</h2>
                    <p className="text-sm font-bold text-gray-400">
                        {assignments.length} assignments tracked for {activeSubject?.code}
                    </p>
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
                            <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors duration-500">
                                <Icons.Calendar size={22} />
                            </div>

                            <div className="space-y-2">
                                {/* Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {assignment.unitId && (() => {
                                        const unitIndex = units.findIndex(u => u.id === assignment.unitId);
                                        return (
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold">
                                                Unit {unitIndex + 1}
                                            </span>
                                        );
                                    })()}
                                    {assignment.platform && (
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">
                                            {assignment.platform}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-black text-gray-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                                    {assignment.title}
                                </h3>
                                <p className="text-sm font-bold text-gray-400 line-clamp-2">
                                    {assignment.description}
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Due Date</span>
                                    <span className="text-sm font-black text-gray-900">{assignment.dueDate}</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openEditModal(assignment); }}
                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                                    >
                                        <Icons.Edit size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteAssignment(assignment.id); }}
                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                    >
                                        <Icons.Delete size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add Card */}
                <button
                    onClick={() => { setEditingAssignment(null); setIsModalOpen(true); }}
                    className="group border-2 border-dashed border-gray-100 rounded-[35px] p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-200 hover:bg-blue-50/10 transition-all duration-500 min-h-[280px]"
                >
                    <div className="w-16 h-16 bg-gray-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center text-gray-300 group-hover:text-blue-600 transition-all duration-500 group-hover:scale-110">
                        <Icons.Plus size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600">New Assignment</p>
                        <p className="text-xs font-bold text-gray-300 mt-1">Add to {activeSubject?.code}</p>
                    </div>
                </button>
            </div>

            <AssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAssignment}
                assignment={editingAssignment}
                subjects={subjects}
            />

            {/* Detail Modal with AI Answer */}
            <Dialog open={!!selectedAssignment} onOpenChange={(open) => !open && setSelectedAssignment(null)}>
                <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[85vh] overflow-y-auto no-scrollbar border-0 bg-white shadow-2xl rounded-3xl">
                    {selectedAssignment && (
                        <div className="space-y-6 py-2">
                            <DialogHeader>
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
                            </DialogHeader>

                            {/* Question/Description */}
                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Question / Description</h4>
                                <p className="text-gray-700 font-medium leading-relaxed text-sm">
                                    {selectedAssignment.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* AI Answer Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">AI Generated Answer</h4>
                                    <div className="flex items-center gap-2">
                                        {/* Export Button */}
                                        {aiAnswer && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                                                >
                                                    <Icons.Download size={14} />
                                                    Export
                                                </button>
                                                {showExportMenu && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                                        <button
                                                            onClick={handleExportWord}
                                                            className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                        >
                                                            <Icons.FileText size={16} />
                                                            Export as Word
                                                        </button>
                                                        <button
                                                            onClick={handlePrint}
                                                            className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                        >
                                                            <Icons.Printer size={16} />
                                                            Print / PDF
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <button
                                            onClick={handleGenerateAnswer}
                                            disabled={isGeneratingAnswer}
                                            className={cn(
                                                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm shrink-0",
                                                isGeneratingAnswer
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:scale-[1.02]"
                                            )}
                                        >
                                            {isGeneratingAnswer ? (
                                                <><Icons.Loader2 size={14} className="animate-spin" /> Generating...</>
                                            ) : (
                                                <><Icons.Sparkles size={14} /> Generate Answer</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {aiAnswer ? (
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 max-h-[50vh] overflow-y-auto no-scrollbar">
                                        <div className="prose prose-sm max-w-none 
                                            prose-headings:font-bold prose-headings:text-gray-800 
                                            prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:border-b-2 prose-h1:border-gray-200 prose-h1:pb-3
                                            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:text-gray-900 prose-h2:font-extrabold
                                            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800 prose-h3:font-bold
                                            prose-h4:text-base prose-h4:mt-5 prose-h4:mb-2 prose-h4:font-bold prose-h4:text-gray-700
                                            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-4
                                            prose-li:text-gray-600 prose-li:my-2
                                            prose-ul:my-4 prose-ul:pl-6 prose-ul:list-disc prose-ol:my-4 prose-ol:pl-6 prose-ol:list-decimal
                                            prose-strong:text-gray-800 prose-strong:font-bold
                                            [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:text-sm [&_table]:border-2 [&_table]:border-gray-300 [&_table]:rounded-lg [&_table]:overflow-hidden
                                            [&_thead]:bg-gray-100
                                            [&_th]:border-2 [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-gray-700 [&_th]:bg-gray-100
                                            [&_td]:border-2 [&_td]:border-gray-200 [&_td]:px-4 [&_td]:py-3 [&_td]:text-gray-600
                                            [&_tr:nth-child(even)]:bg-gray-50
                                            [&_tbody_tr:hover]:bg-blue-50
                                            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-purple-700
                                            prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-6
                                            prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:pl-4 prose-blockquote:py-3 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-600
                                            prose-hr:my-8 prose-hr:border-gray-200
                                            [&>*:first-child]:mt-0">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {aiAnswer}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                            <Icons.Sparkles size={28} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-400">Click "Generate Answer" to get AI assistance</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
