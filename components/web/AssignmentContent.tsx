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

    // Alert State
    const [dueAlerts, setDueAlerts] = useState<Assignment[]>([]);
    const [showDueAlert, setShowDueAlert] = useState(false);

    useEffect(() => {
        const checkDueAssignments = async () => {
            try {
                const allAssignments = await getAssignments(); // Fetch all subjects' assignments
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const twoDaysFromNow = new Date(today);
                twoDaysFromNow.setDate(today.getDate() + 2);

                const due = allAssignments.filter(a => {
                    const d = new Date(a.dueDate);
                    // Fix potential timezone offset by treating date string as local midnight
                    // Simple hack: append T00:00 to ensure valid ISO if missing, or just parse
                    const datePart = a.dueDate.split('T')[0];
                    const dObj = new Date(datePart + 'T00:00:00');
                    return dObj >= today && dObj <= twoDaysFromNow;
                });

                if (due.length > 0) {
                    setDueAlerts(due);
                    setShowDueAlert(true);
                    const timer = setTimeout(() => setShowDueAlert(false), 20000); // 20 seconds
                    return () => clearTimeout(timer);
                }
            } catch (error) {
                console.error("Failed to check due assignments", error);
            }
        };

        checkDueAssignments(); // Run on mount
        const interval = setInterval(checkDueAssignments, 5 * 60 * 1000); // Run every 5 mins

        return () => clearInterval(interval);
    }, []);

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
                <DialogContent className="sm:max-w-5xl max-w-[95vw] h-[85vh] flex flex-col overflow-hidden border-0 bg-white shadow-2xl rounded-3xl p-0 gap-0">
                    {selectedAssignment && (
                        <div className="flex flex-col h-full">
                            {/* Header Section */}
                            <div className="p-8 pb-4 shrink-0">
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

                            </div>

                            {/* Question/Description */}
                            <div className="px-8 pb-4 shrink-0">
                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Question / Description</h4>
                                    <p className="text-gray-700 font-medium leading-relaxed text-sm line-clamp-3">
                                        {selectedAssignment.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            {/* AI Answer Section */}
                            <div className="flex-1 flex flex-col min-h-0 px-8 pb-8">
                                <div className="flex items-center justify-between gap-4 flex-wrap mb-4 shrink-0">
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
                                    <div className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden relative">
                                        <div className="absolute inset-0 overflow-y-auto no-scrollbar p-8">
                                            <div className="text-gray-900 pb-8">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        h1: ({ node, ...props }) => <h1 className="text-2xl font-black text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-xl font-extrabold text-gray-900 mt-6 mb-3" {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-gray-800 mt-5 mb-2" {...props} />,
                                                        h4: ({ node, ...props }) => <h4 className="text-base font-bold text-gray-700 mt-4 mb-2" {...props} />,
                                                        p: ({ node, ...props }) => <p className="text-gray-700 leading-relaxed mb-4 text-sm" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                                                        li: ({ node, ...props }) => <li className="text-gray-700 text-sm" {...props} />,
                                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 italic text-gray-600 mb-4 rounded-r" {...props} />,
                                                        table: ({ node, ...props }) => <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200"><table className="w-full text-sm text-left border-collapse" {...props} /></div>,
                                                        thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                                                        th: ({ node, ...props }) => <th className="px-4 py-3 font-bold text-gray-700 border-b border-gray-200" {...props} />,
                                                        td: ({ node, ...props }) => <td className="px-4 py-3 border-b border-gray-100" {...props} />,
                                                        tr: ({ node, ...props }) => <tr className="even:bg-gray-50 hover:bg-gray-50/50" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                        code: ({ node, ...props }) => <code className="bg-gray-100 text-purple-700 px-1 py-0.5 rounded font-mono text-xs" {...props} />
                                                    }}
                                                >
                                                    {aiAnswer}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
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

            {/* Due Date Alert Popup */}
            {showDueAlert && dueAlerts.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-5 max-w-sm w-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                        <button
                            onClick={() => setShowDueAlert(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Icons.X size={16} />
                        </button>

                        <div className="pl-4">
                            <div className="flex items-center gap-2 mb-2 text-red-600">
                                <Icons.AlertTriangle size={20} className="animate-pulse" />
                                <h4 className="font-bold text-sm uppercase tracking-wide">Due Soon</h4>
                            </div>
                            <p className="text-gray-600 text-xs font-medium mb-3">
                                You have {dueAlerts.length} assignment{dueAlerts.length > 1 ? 's' : ''} due within the next 2 days:
                            </p>
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 no-scrollbar">
                                {dueAlerts.map(alert => (
                                    <div key={alert.id} className="bg-red-50 rounded-lg p-2 border border-red-100">
                                        <p className="font-bold text-gray-800 text-xs truncate">{alert.title}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[10px] text-red-500 font-bold">{alert.dueDate}</span>
                                            {alert.platform && (
                                                <span className="text-[9px] bg-white px-1.5 py-0.5 rounded text-gray-500 border border-red-100">{alert.platform}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

