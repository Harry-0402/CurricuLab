"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { getSubjects, getUnits, getMarkWiseQuestions, createMarkWiseQuestion, updateMarkWiseQuestion, deleteMarkWiseQuestion, MarkWiseQuestion } from '@/lib/services/app.service';
import { AiService } from '@/lib/services/ai-service';
import { Subject, Unit, MarksType } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/components/shared/Toast';

export function MarkWiseContent() {
    const { showToast } = useToast();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [questions, setQuestions] = useState<MarkWiseQuestion[]>([]);

    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [selectedMarks, setSelectedMarks] = useState<string>('');
    const [activeQuestion, setActiveQuestion] = useState<MarkWiseQuestion | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [formattedAnswer, setFormattedAnswer] = useState<string>('');
    const [isFormatting, setIsFormatting] = useState(false);

    // Add Question Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        subjectId: '',
        unitId: '',
        marksType: 10 as MarksType,
        question: '',
        answer: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        getSubjects().then(setSubjects);
    }, []);

    // Load Units when Subject changes
    useEffect(() => {
        if (selectedSubject) {
            getUnits(selectedSubject).then(setUnits);
            setSelectedUnit('');
            setActiveQuestion(null);
            setQuestions([]);
        }
    }, [selectedSubject]);

    // Load Questions when filters change
    useEffect(() => {
        const loadQuestions = async () => {
            if (selectedSubject) {
                setIsLoading(true);
                const data = await getMarkWiseQuestions({
                    subjectId: selectedSubject,
                    unitId: selectedUnit || undefined,
                    marksType: selectedMarks ? Number(selectedMarks) : undefined
                });
                setQuestions(data);
                setIsLoading(false);
            }
        };
        loadQuestions();
    }, [selectedSubject, selectedUnit, selectedMarks]);

    // Auto-format answer when question is selected
    useEffect(() => {
        const formatAnswer = async () => {
            if (!activeQuestion?.answer) {
                setFormattedAnswer('');
                return;
            }

            // Use cached formatted answer if available
            if (activeQuestion.formattedAnswer) {
                setFormattedAnswer(activeQuestion.formattedAnswer);
                return;
            }

            // Format with AI
            setIsFormatting(true);
            setFormattedAnswer('');

            try {
                const formatted = await AiService.formatUserAnswer(
                    activeQuestion.question,
                    activeQuestion.answer,
                    activeQuestion.marksType
                );
                setFormattedAnswer(formatted);

                // Cache the formatted answer in the database
                const updated = await updateMarkWiseQuestion({
                    ...activeQuestion,
                    formattedAnswer: formatted
                });

                // Update the active question with cached format
                if (updated) {
                    setActiveQuestion(updated);
                }
            } catch (error) {
                console.error("Failed to format answer:", error);
                setFormattedAnswer(activeQuestion.answer);
            } finally {
                setIsFormatting(false);
            }
        };

        formatAnswer();
    }, [activeQuestion?.id, activeQuestion?.answer]);

    const handleSaveQuestion = async () => {
        if (!newQuestion.subjectId || !newQuestion.question) return;

        setIsSaving(true);
        let saved: MarkWiseQuestion | null = null;

        if (editingId) {
            saved = await updateMarkWiseQuestion({
                id: editingId,
                unitId: newQuestion.unitId,
                subjectId: newQuestion.subjectId,
                question: newQuestion.question,
                answer: newQuestion.answer,
                formattedAnswer: '', // Clear cached format when answer changes
                marksType: newQuestion.marksType,
                tags: activeQuestion?.tags || [],
                isBookmarked: activeQuestion?.isBookmarked || false,
            });
        } else {
            saved = await createMarkWiseQuestion({
                subjectId: newQuestion.subjectId,
                unitId: newQuestion.unitId,
                question: newQuestion.question,
                answer: newQuestion.answer,
                formattedAnswer: '',
                marksType: newQuestion.marksType,
                tags: [],
                isBookmarked: false,
            });
        }

        if (saved) {
            if (editingId) {
                setIsAddModalOpen(false);
                showToast('Question updated successfully!', 'success');
            } else {
                showToast('Question added successfully!', 'success');
            }

            setNewQuestion({
                subjectId: newQuestion.subjectId,
                unitId: newQuestion.unitId,
                marksType: 10,
                question: '',
                answer: ''
            });
            setEditingId(null);

            if (saved.subjectId === selectedSubject) {
                const data = await getMarkWiseQuestions({
                    subjectId: selectedSubject,
                    unitId: selectedUnit || undefined,
                    marksType: selectedMarks ? Number(selectedMarks) : undefined
                });
                setQuestions(data);
                if (editingId && activeQuestion?.id === editingId) {
                    setActiveQuestion(saved);
                }
            }
        }
        setIsSaving(false);
    };

    const handleEditClick = (e: React.MouseEvent, q: MarkWiseQuestion) => {
        e.stopPropagation();
        setEditingId(q.id);
        setNewQuestion({
            subjectId: q.subjectId,
            unitId: q.unitId,
            marksType: q.marksType as MarksType,
            question: q.question,
            answer: q.answer || ''
        });
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this question?')) {
            const success = await deleteMarkWiseQuestion(id);
            if (success) {
                setQuestions(prev => prev.filter(q => q.id !== id));
                if (activeQuestion?.id === id) {
                    setActiveQuestion(null);
                }
                showToast('Question deleted', 'info');
            }
        }
    };

    return (
        <WebAppShell>
            <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-[1800px] mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">MarkWise</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setNewQuestion({
                                subjectId: selectedSubject || '',
                                unitId: selectedUnit || '',
                                marksType: 10,
                                question: '',
                                answer: ''
                            });
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                        <Icons.Plus size={18} />
                        <span>New Question</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm shrink-0">
                    <div className="relative">
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none pr-10"
                        >
                            <option value="">Select Subject...</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                        </select>
                        <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            disabled={!selectedSubject}
                            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 appearance-none pr-10"
                        >
                            <option value="">All Units</option>
                            {units.map(u => <option key={u.id} value={u.id}>Unit {u.order}: {u.title}</option>)}
                        </select>
                    </div>

                    <div className="relative">
                        <select
                            value={selectedMarks}
                            onChange={(e) => setSelectedMarks(e.target.value)}
                            disabled={!selectedSubject}
                            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 appearance-none pr-10"
                        >
                            <option value="">All Marks</option>
                            {[2, 7, 8, 10, 15].map(m => <option key={m} value={m.toString()}>{m} Marks</option>)}
                        </select>
                        <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Main Content - Split Pane */}
                <div className="flex-1 flex gap-6 min-h-0">

                    {/* Left Panel: Question List */}
                    <div className="w-5/12 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                                Questions ({questions.length})
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                            {isLoading ? (
                                <div className="flex justify-center p-8"><Icons.Loader2 className="animate-spin text-blue-500" /></div>
                            ) : questions.length === 0 ? (
                                <div className="text-center p-8 text-gray-400 text-sm">No questions found.</div>
                            ) : (
                                questions.map(q => (
                                    <div
                                        key={q.id}
                                        onClick={() => { setActiveQuestion(q); setFormattedAnswer(''); }}
                                        className={cn(
                                            "p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md group relative",
                                            activeQuestion?.id === q.id
                                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                                : "bg-white border-gray-100 hover:border-blue-100"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                                                {q.marksType} Marks
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => handleEditClick(e, q)}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Icons.Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, q.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icons.Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800 line-clamp-3 mb-2">{q.question}</p>
                                        {q.answer && (
                                            <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                                <Icons.Check size={12} />
                                                Answer saved
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Answer Display */}
                    <div className="w-7/12 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
                        {activeQuestion ? (
                            <div className="flex flex-col h-full">
                                {/* Question Header */}
                                <div className="p-6 border-b border-gray-100 bg-gray-50/30 shrink-0">
                                    <h2 className="text-lg font-black text-gray-900 leading-tight mb-4">
                                        {activeQuestion.question}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                                            {activeQuestion.marksType} Marks
                                        </span>
                                        {activeQuestion.answer ? (
                                            isFormatting && (
                                                <span className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Icons.Loader2 className="animate-spin" size={16} />
                                                    Formatting...
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">No answer saved yet. Edit to add an answer.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Answer Area */}
                                <div className="flex-1 overflow-y-auto p-8 bg-white no-scrollbar">
                                    {formattedAnswer ? (
                                        <div className="w-full">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-gray-800 mt-5 mb-3" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />,
                                                    p: ({ node, ...props }) => <p className="text-gray-600 leading-relaxed mb-4" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                                                    strong: ({ node, ...props }) => <span className="font-bold text-gray-900" {...props} />,
                                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-500 my-4" {...props} />,
                                                    code: ({ node, ...props }) => <code className="bg-gray-100 text-blue-600 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                                                    table: ({ node, ...props }) => <table className="w-full border-collapse border border-gray-200 my-4 rounded-lg overflow-hidden" {...props} />,
                                                    thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                                                    tbody: ({ node, ...props }) => <tbody {...props} />,
                                                    tr: ({ node, ...props }) => <tr className="border-b border-gray-200" {...props} />,
                                                    th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 border border-gray-200" {...props} />,
                                                    td: ({ node, ...props }) => <td className="px-4 py-2 text-sm text-gray-600 border border-gray-200" {...props} />
                                                }}
                                            >
                                                {formattedAnswer}
                                            </ReactMarkdown>
                                        </div>
                                    ) : isFormatting ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                            <Icons.Loader2 className="animate-spin text-blue-500" size={48} />
                                            <p className="font-bold text-xs uppercase tracking-widest">Formatting your answer...</p>
                                        </div>
                                    ) : activeQuestion.answer ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Icons.FileText size={32} />
                                            </div>
                                            <p className="font-bold text-xs uppercase tracking-widest">Processing...</p>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Icons.Edit size={32} />
                                            </div>
                                            <p className="font-bold text-xs uppercase tracking-widest">No answer yet</p>
                                            <p className="text-gray-400 text-sm">Edit this question to add your answer</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                <Icons.ArrowLeft size={32} />
                                <p className="font-bold text-xs uppercase tracking-widest">Select a question to view details</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Add Question Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-gray-900">{editingId ? 'Edit Question' : 'Add New Question'}</h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <Icons.X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                                    <div className="relative">
                                        <select
                                            value={newQuestion.subjectId}
                                            onChange={(e) => {
                                                setNewQuestion({ ...newQuestion, subjectId: e.target.value, unitId: '' });
                                                getUnits(e.target.value).then(setUnits);
                                            }}
                                            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                        >
                                            <option value="">Select Subject...</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                                        </select>
                                        <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Unit</label>
                                        <div className="relative">
                                            <select
                                                value={newQuestion.unitId}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, unitId: e.target.value })}
                                                disabled={!newQuestion.subjectId}
                                                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none disabled:opacity-50"
                                            >
                                                <option value="">Select Unit...</option>
                                                {(newQuestion.subjectId ? units : []).map(u => <option key={u.id} value={u.id}>Unit {u.order}</option>)}
                                            </select>
                                            <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Marks</label>
                                        <div className="relative">
                                            <select
                                                value={newQuestion.marksType}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, marksType: Number(e.target.value) as MarksType })}
                                                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                            >
                                                {[2, 7, 8, 10, 15].map(m => <option key={m} value={m}>{m} Marks</option>)}
                                            </select>
                                            <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Question</label>
                                    <textarea
                                        rows={3}
                                        value={newQuestion.question}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                        placeholder="Enter the full question text..."
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Answer</label>
                                    <textarea
                                        rows={5}
                                        value={newQuestion.answer}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                                        placeholder="Enter your answer here..."
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleSaveQuestion}
                                    disabled={isSaving || !newQuestion.question || !newQuestion.subjectId}
                                    className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isSaving ? <Icons.Loader2 className="animate-spin" /> : (editingId ? <Icons.Edit size={16} /> : <Icons.PlusCircle size={16} />)}
                                    {isSaving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Question' : 'Add Question')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </WebAppShell>
    );
}
