"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { useToast } from '@/components/shared/Toast';
import { cn } from '@/lib/utils';
import { Subject, Assignment, Unit } from '@/types';
import { getSubjects, getAssignments, getSemesterAssignments, createAssignment, updateAssignment, deleteAssignment, getUnits } from '@/lib/services/app.service';
import { AiService } from '@/lib/services/ai-service';
import { useSearchParams } from 'next/navigation';

import { AssignmentModal } from './AssignmentModal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/shared/Dialog";
import { AnswerDisplay } from './AnswerDisplay';

import { useSemester } from '@/components/providers/SemesterProvider';
import { SubjectService } from '@/lib/data/subject-service';
import { useAppStore } from '@/lib/store/useAppStore';

export function AssignmentContent() {
    const { activeSemesterId, setActiveSemester } = useSemester();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const querySubjectId = searchParams.get('subjectId');
    const queryAssignmentId = searchParams.get('assignmentId');
    const setAnalyticaOpen = useAppStore(state => state.setAnalyticaOpen);
    const setAnalyticaInput = useAppStore(state => state.setAnalyticaInput);

    // Automatically switch active semester to the subject's semester if deep-linked to a subject in another semester
    useEffect(() => {
        const checkAndSwitchSemester = async () => {
            if (querySubjectId) {
                const sub = await SubjectService.getById(querySubjectId);
                if (sub && sub.semesterId && sub.semesterId !== activeSemesterId) {
                    setActiveSemester(sub.semesterId);
                }
            }
        };
        checkAndSwitchSemester();
    }, [querySubjectId, activeSemesterId, setActiveSemester]);

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [completedAssignments, setCompletedAssignments] = useState<Set<string>>(new Set());
    const [currentUser, setCurrentUser] = useState<any>(null);

    const getSubjectCardStyles = (subjectId: string) => {
        const subject = subjects.find(s => s.id === subjectId);
        const code = subject?.code || '';
        const norm = code.toUpperCase();
        if (norm.startsWith('PBA301')) return { border: 'hover:border-emerald-300 border-l-4 border-l-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-700', hoverBg: 'hover:bg-emerald-50/10' };
        if (norm.startsWith('PBA302')) return { border: 'hover:border-blue-300 border-l-4 border-l-blue-500', badgeBg: 'bg-blue-50 text-blue-700', hoverBg: 'hover:bg-blue-50/10' };
        if (norm.startsWith('PBA303')) return { border: 'hover:border-indigo-300 border-l-4 border-l-indigo-500', badgeBg: 'bg-indigo-50 text-indigo-700', hoverBg: 'hover:bg-indigo-50/10' };
        if (norm.startsWith('PBA304')) return { border: 'hover:border-purple-300 border-l-4 border-l-purple-500', badgeBg: 'bg-purple-50 text-purple-700', hoverBg: 'hover:bg-purple-50/10' };
        if (norm.startsWith('PBA309')) return { border: 'hover:border-rose-300 border-l-4 border-l-rose-500', badgeBg: 'bg-rose-50 text-rose-700', hoverBg: 'hover:bg-rose-50/10' };
        if (norm.startsWith('PBA311')) return { border: 'hover:border-amber-300 border-l-4 border-l-amber-500', badgeBg: 'bg-amber-50 text-amber-700', hoverBg: 'hover:bg-amber-50/10' };
        if (norm.startsWith('PBAE03')) return { border: 'hover:border-teal-300 border-l-4 border-l-teal-500', badgeBg: 'bg-teal-50 text-teal-700', hoverBg: 'hover:bg-teal-50/10' };
        if (norm.startsWith('PBAGE')) return { border: 'hover:border-orange-300 border-l-4 border-l-orange-500', badgeBg: 'bg-orange-50 text-orange-700', hoverBg: 'hover:bg-orange-50/10' };
        if (norm.startsWith('VAP')) return { border: 'hover:border-cyan-300 border-l-4 border-l-cyan-500', badgeBg: 'bg-cyan-50 text-cyan-700', hoverBg: 'hover:bg-cyan-50/10' };
        return { border: 'hover:border-gray-300 border-l-4 border-l-gray-400', badgeBg: 'bg-gray-50 text-gray-700', hoverBg: 'hover:bg-gray-50/10' };
    };

    // Detail Modal State
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [generatingQuestionIndex, setGeneratingQuestionIndex] = useState<number | null>(null);
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Delete Confirmation State
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const isToggle = target.closest(`[data-menu-toggle="action-toggle-${openMenuIndex}"]`);

            if (menuRef.current && !menuRef.current.contains(target) && !isToggle) {
                setOpenMenuIndex(null);
            }
        };

        if (openMenuIndex !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuIndex]);

    useEffect(() => {
        const loadUserAndCompletions = async () => {
            const { supabase } = await import('@/utils/supabase/client');
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setCurrentUser(session.user);
                const { data } = await supabase
                    .from('user_completed_assignments')
                    .select('assignment_id')
                    .eq('user_id', session.user.id);
                if (data) {
                    setCompletedAssignments(new Set(data.map(d => d.assignment_id)));
                }
            }
        };
        loadUserAndCompletions();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const fetchedSubjects = await SubjectService.getAll(activeSemesterId ?? undefined);
            setSubjects(fetchedSubjects);
            if (fetchedSubjects.length > 0) {
                // Priority: Query Param > Storage > Default
                const validQuerySubject = fetchedSubjects.find(s => s.id === querySubjectId);
                const storedSubjectId = localStorage.getItem('activeSubjectId');
                const isStoredAll = storedSubjectId === 'all';
                const validStoredSubject = fetchedSubjects.find(s => s.id === storedSubjectId);

                if (validQuerySubject) {
                    setActiveSubjectId(validQuerySubject.id);
                } else if (isStoredAll || !storedSubjectId) {
                    setActiveSubjectId('all');
                } else {
                    setActiveSubjectId(validStoredSubject ? validStoredSubject.id : 'all');
                }
            } else {
                setLoading(false);
            }
        };
        loadData();
    }, [querySubjectId, activeSemesterId]);

    useEffect(() => {
        const loadAssignments = async () => {
            if (activeSubjectId) {
                setLoading(true);
                localStorage.setItem('activeSubjectId', activeSubjectId); // Persist subject selection logic

                let fetched: Assignment[] = [];
                let fetchedUnits: Unit[] = [];

                if (activeSubjectId === 'all') {
                    if (activeSemesterId) {
                        fetched = await getSemesterAssignments(activeSemesterId);
                        if (subjects.length > 0) {
                            const allUnitsPromises = subjects.map(s => getUnits(s.id));
                            const unitsResults = await Promise.all(allUnitsPromises);
                            fetchedUnits = unitsResults.flat();
                        }
                    }
                } else {
                    [fetched, fetchedUnits] = await Promise.all([
                        getAssignments(activeSubjectId),
                        getUnits(activeSubjectId)
                    ]);
                }

                setAssignments(fetched);
                setUnits(fetchedUnits);

                // Priority: Query Param > Storage
                const targetAssignmentId = queryAssignmentId || localStorage.getItem('openAssignmentId');
                if (targetAssignmentId) {
                    const restoredAssignment = fetched.find(a => a.id === targetAssignmentId);
                    if (restoredAssignment) {
                        setSelectedAssignment(restoredAssignment);
                    }
                }

                setLoading(false);
            }
        };
        loadAssignments();
    }, [activeSubjectId, queryAssignmentId, activeSemesterId, subjects]);

    const activeSubject = subjects.find(s => s.id === activeSubjectId);

    const handleSaveAssignment = async (data: Partial<Assignment>) => {
        try {
            if (editingAssignment) {
                // Update
                const updated = await updateAssignment({ ...editingAssignment, ...data } as Assignment);
                if (activeSubjectId === 'all' || updated.subjectId === activeSubjectId) {
                    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
                } else {
                    // Moved to another subject, remove from current view
                    setAssignments(prev => prev.filter(a => a.id !== updated.id));
                }
                showToast('Assignment updated successfully!', 'success');
            } else {
                // Create
                const newAssignment = await createAssignment({
                    id: crypto.randomUUID(),
                    title: data.title || 'Untitled',
                    description: data.description || '',
                    questions: data.questions || [],
                    subjectId: data.subjectId || (activeSubjectId !== 'all' ? activeSubjectId! : subjects[0]?.id || ''),
                    dueDate: data.dueDate || new Date().toISOString().split('T')[0],
                    unitId: data.unitId || undefined,
                    platform: data.platform
                } as Assignment);

                if (activeSubjectId === 'all' || newAssignment.subjectId === activeSubjectId) {
                    setAssignments(prev => [...prev, newAssignment]);
                }
                showToast('Assignment created successfully!', 'success');

                // Trigger push notification to class students
                fetch('/api/push/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: 'New Assignment Created',
                        message: `A new assignment "${newAssignment.title}" has been created. Due Date: ${newAssignment.dueDate}`,
                        url: '/assignments',
                        targetSemesterId: activeSemesterId
                    })
                }).catch(console.error);
            }
        } catch (error) {
            console.error("Failed to save assignment:", error);
            showToast('Failed to save assignment', 'error');
        }
        setEditingAssignment(null);
    };

    const toggleCompletion = async (e: React.MouseEvent, assignmentId: string) => {
        e.stopPropagation();
        if (!currentUser) return;
        
        const { supabase } = await import('@/utils/supabase/client');
        const isCompleted = completedAssignments.has(assignmentId);
        
        // Optimistic update
        setCompletedAssignments(prev => {
            const next = new Set(prev);
            if (isCompleted) next.delete(assignmentId);
            else next.add(assignmentId);
            return next;
        });

        if (isCompleted) {
            await supabase
                .from('user_completed_assignments')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('assignment_id', assignmentId);
        } else {
            await supabase
                .from('user_completed_assignments')
                .insert({ user_id: currentUser.id, assignment_id: assignmentId });
        }
    };

    const handleDeleteAssignment = async (id: string) => {
        try {
            await deleteAssignment(id);
            setAssignments(prev => prev.filter(a => a.id !== id));
            showToast('Assignment deleted successfully', 'success');
        } catch (error) {
            console.error("Failed to delete assignment:", error);
            showToast('Failed to delete assignment', 'error');
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
        setGeneratingQuestionIndex(questionIndex);

        try {
            const subject = subjects.find(s => s.id === selectedAssignment.subjectId);
            const unit = selectedAssignment.unitId ? units.find(u => u.id === selectedAssignment.unitId) : null;
            const topicsContext = unit?.topics?.length ? `\nRelevant Topics: ${unit.topics.join(', ')}` : '';

            const prompt = `You are a helpful, clear, and friendly academic assistant providing a comprehensive answer to a specific assignment question. Your goal is to explain concepts in a way that is easy to understand, avoiding overly "heavy" academic jargon or dry, corporate-style AI clichés (like "In today's rapidly evolving global economy").
 
 Subject: ${subject?.title || 'Business Administration'}
 ${unit ? `Unit: ${unit.title}` : ''}
 ${topicsContext}
 
 Assignment Title: ${selectedAssignment.title}
 Question: ${question.text}
 
 Provide a clear, clean, and humanoid answer that:
 1. MUST use Heading 2 (##) for the Question Title
 2. MUST use Heading 3 (###) for major sections (e.g., Key Points, Steps, or Overview)
 3. Use simple, direct language. Be conversational but informative.
 4. If code is requested, provide it in a standard Markdown code block with language identifier (e.g., \`\`\`python)
 5. Separate the explanation and the code implementation clearly.
 6. Includes relevant examples and practical applications.
 7. Uses **bold** for key terms.
 8. Uses bullet points (-) for listing features or steps.
 9. Adds a comparison table if it helps clarify things.
 10. Keep paragraphs very short and scannable.
 
 Format the response in clean, readable markdown. Make sure the code is accurate and well-commented.`;

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
            setGeneratingQuestionIndex(null);
        }
    };

    const handleClearAnswer = async (questionIndex: number) => {
        if (!selectedAssignment) return;

        const updatedQuestions = [...selectedAssignment.questions];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            answer: undefined
        };

        const updatedAssignment = {
            ...selectedAssignment,
            questions: updatedQuestions
        };

        try {
            await updateAssignment(updatedAssignment);
            setSelectedAssignment(updatedAssignment);
            setAssignments(prev => prev.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
            showToast('Answer cleared', 'success');
        } catch (error) {
            console.error('Failed to clear answer:', error);
            showToast('Failed to clear answer', 'error');
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



    return (
        <div className="space-y-10">
            {/* Header Area */}
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Academic</h1>
                    <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Assignments</p>
                </div>
                <button
                    onClick={() => { setEditingAssignment(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-8 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 shrink-0"
                >
                    <Icons.Plus size={16} className="md:hidden" />
                    <Icons.Plus size={18} className="hidden md:block" />
                    <span className="hidden sm:inline">New Assignment</span>
                    <span className="sm:hidden">New</span>
                </button>
            </div>

            {/* Subject Switcher */}
            {/* Mobile: Dropdown */}
            <div className="block sm:hidden">
                <div className="relative">
                    <select
                        value={activeSubjectId || 'all'}
                        onChange={(e) => setActiveSubjectId(e.target.value === 'all' ? 'all' : e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 cursor-pointer"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.code} — {subject.title}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Icons.ChevronDown size={16} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Desktop: Pills */}
            <div className="hidden sm:flex items-center gap-1.5 pb-2 flex-wrap">
                <button
                    onClick={() => setActiveSubjectId('all')}
                    className={cn(
                        "px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1.5 border shadow-sm",
                        activeSubjectId === 'all'
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                            : "bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                    )}
                >
                    <span className="text-[10px] font-black tracking-widest uppercase">
                        All
                    </span>
                    {activeSubjectId === 'all' && (
                        <div className="w-1 h-1 bg-white rounded-full shrink-0" />
                    )}
                </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
                        <p className="text-sm font-bold text-gray-400">Loading...</p>
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="col-span-full py-20 bg-gray-50 rounded-[35px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                            <Icons.BookOpen size={28} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Subjects Found</h3>
                        <p className="text-sm font-bold text-gray-400">There are no subjects in this semester.</p>
                    </div>
                ) : assignments.length === 0 ? (
                    <div className="col-span-full py-20 bg-gray-50 rounded-[35px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                            <Icons.Calendar size={28} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">No Assignments Yet</h3>
                        <p className="text-sm font-bold text-gray-400">Assignments are not Uploaded yet</p>
                    </div>
                ) : (
                    assignments.map((assignment) => {
                        const cardStyles = getSubjectCardStyles(assignment.subjectId);
                        return (
                            <div
                                key={assignment.id}
                                onClick={() => openDetailModal(assignment)}
                                className={cn(
                                    "group bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden cursor-pointer",
                                    cardStyles.border,
                                    cardStyles.hoverBg
                                )}
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500",
                                            completedAssignments.has(assignment.id)
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                                        )}>
                                            <Icons.Calendar size={22} />
                                        </div>
                                        {/* Badges */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {(() => {
                                                const subject = subjects.find(s => s.id === assignment.subjectId);
                                                return subject ? (
                                                    <span className={cn("h-12 px-4 rounded-2xl text-xs font-bold flex items-center justify-center", cardStyles.badgeBg)}>
                                                        {subject.code}
                                                    </span>
                                                ) : null;
                                            })()}
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
                                        <span className="text-sm font-black text-gray-900">{assignment.dueDate || 'No due date'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => toggleCompletion(e, assignment.id)}
                                            className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${completedAssignments.has(assignment.id) ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            <Icons.CheckSquare size={16} />
                                            <span className="hidden sm:inline">{completedAssignments.has(assignment.id) ? 'Completed' : 'Mark Done'}</span>
                                        </button>
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
                    );
                })
            )}
            </div>

            <AssignmentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingAssignment(null);
                }}
                onSave={handleSaveAssignment}
                assignment={editingAssignment}
                subjects={subjects}
                activeSubjectId={activeSubjectId === 'all' ? null : activeSubjectId}
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
                                        <div className="flex-1 pr-12">
                                            <DialogTitle className="text-2xl font-black text-gray-900 pr-8">
                                                {selectedAssignment.title}
                                            </DialogTitle>
                                            <DialogDescription asChild>
                                                <div className="space-y-2 mt-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                                                        <Icons.Calendar size={14} />
                                                        <span>Due: {selectedAssignment.dueDate || 'No due date'}</span>
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
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assignment Questions</h4>
                                            
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!selectedAssignment || selectedAssignment.questions.length === 0) {
                                                        showToast("No questions to copy", "error");
                                                        return;
                                                    }
                                                    const questionList = selectedAssignment.questions
                                                        .map((q, idx) => `${idx + 1}. ${q.text}`)
                                                        .join('\n');
                                                    const targetSubject = subjects.find(s => s.id === selectedAssignment.subjectId);
                                                    const subjectName = targetSubject?.title || 'the subject';
                                                    
                                                    const prompt = `Here is a list of questions for my assignment:\n\n${questionList}\n\n\nPlease help me answer them based on ${subjectName}.\n\nInstructions:\n- The language should be simple, clear, and humanoid.\n- The word limit should be in 110-120 words for each question.`;

                                                    navigator.clipboard.writeText(prompt).then(() => {
                                                        showToast("Questions copied! Opening Analytica...", "success");
                                                        setAnalyticaOpen(true);
                                                        setAnalyticaInput(prompt);
                                                    }).catch(() => {
                                                        showToast("Failed to copy to clipboard, but opening Analytica...", "error");
                                                        setAnalyticaOpen(true);
                                                        setAnalyticaInput(prompt);
                                                    });
                                                }}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all shadow-sm active:scale-95 shrink-0"
                                            >
                                                <Icons.Sparkles size={14} className="text-white" />
                                                Solve via AI (Copy Prompt)
                                            </button>
                                        </div>
                                        
                                        <div className="hidden sm:flex text-[11px] font-medium text-purple-600 bg-purple-50/50 border border-purple-100/50 p-3.5 rounded-2xl items-start gap-2 leading-relaxed">
                                            <Icons.Info size={14} className="shrink-0 mt-0.5 text-purple-500" />
                                            <span>
                                                <strong>How to use:</strong> Click <strong>"Solve via AI"</strong> above to instantly open Analytica with a customized, structured prompt containing these questions. You can also paste it into ChatGPT, Gemini, or Claude.
                                            </span>
                                        </div>
                                        {selectedAssignment.questions.length === 0 && (
                                            <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                                <p className="text-sm font-bold text-gray-400">No questions added to this assignment.</p>
                                            </div>
                                        )}
                                        {selectedAssignment.questions.map((q, idx) => (
                                            <div key={q.id} className="bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 shrink-0 mt-1">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-gray-900 font-bold text-base leading-snug pt-1">
                                                        {q.text}
                                                    </p>
                                                </div>
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

