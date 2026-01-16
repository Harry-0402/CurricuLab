"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { getSubjects, getUnits, getQuestions } from '@/lib/services/app.service';
import { AiService } from '@/lib/services/ai-service';
import { Subject, Unit, Question } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function PaperTrailContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);

    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [aiAnswer, setAiAnswer] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

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

    // Load Questions when Unit changes
    useEffect(() => {
        const loadQuestions = async () => {
            if (selectedSubject) {
                setIsLoading(true);
                const data = await getQuestions({
                    subjectId: selectedSubject,
                    unitId: selectedUnit || undefined
                });
                setQuestions(data);
                setIsLoading(false);
            }
        };
        loadQuestions();
    }, [selectedSubject, selectedUnit]);

    // Generate AI Answer
    const handleGenerateAnswer = async () => {
        if (!activeQuestion || !selectedSubject) return;

        setIsGenerating(true);
        setAiAnswer('');

        try {
            const subject = subjects.find(s => s.id === selectedSubject);
            const unit = units.find(u => u.id === activeQuestion.unitId);

            const prompt = `You are an expert university professor.

Subject: ${subject?.title}
${unit ? `Unit: ${unit.title}` : ''}
Question: "${activeQuestion.question}"
Marks: ${activeQuestion.marksType}

Provide a comprehensive, exam-grade answer to this question.
Structure your answer with:
1. **Introduction**: Brief context.
2. **Key Concepts**: Core theory/definitions.
3. **Detailed Explanation**: Points, steps, or analysis.
4. **Examples**: Real-world application.
5. **Conclusion**: Summary.

Format using clean Markdown (H2 for sections, bold for keywords, bullet points).`;

            const answer = await AiService.generateContent(prompt);
            setAiAnswer(answer);

        } catch (error) {
            console.error("Failed to generate answer", error);
            setAiAnswer("Error generating answer. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <WebAppShell>
            <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-[1800px] mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">PaperTrail</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm shrink-0">
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
                                        onClick={() => { setActiveQuestion(q); setAiAnswer(''); }}
                                        className={cn(
                                            "p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md",
                                            activeQuestion?.id === q.id
                                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                                : "bg-white border-gray-100 hover:border-blue-100"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                                                q.difficulty === 'Easy' ? "bg-green-100 text-green-700" :
                                                    q.difficulty === 'Medium' ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-red-100 text-red-700"
                                            )}>
                                                {q.difficulty}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400">{q.marksType} Marks</span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800 line-clamp-3">{q.question}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel: AI Answer */}
                    <div className="w-7/12 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
                        {activeQuestion ? (
                            <div className="flex flex-col h-full">
                                {/* Question Header */}
                                <div className="p-6 border-b border-gray-100 bg-gray-50/30 shrink-0">
                                    <h2 className="text-lg font-black text-gray-900 leading-tight mb-4">
                                        {activeQuestion.question}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleGenerateAnswer}
                                            disabled={isGenerating}
                                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isGenerating ? <Icons.Loader2 className="animate-spin" size={16} /> : <Icons.Sparkles size={16} />}
                                            {isGenerating ? 'Drafting Answer...' : 'Generate Answer'}
                                        </button>
                                    </div>
                                </div>

                                {/* Answer Area */}
                                <div className="flex-1 overflow-y-auto p-8 bg-white no-scrollbar">
                                    {aiAnswer ? (
                                        <div className="prose prose-blue max-w-none prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {aiAnswer}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Icons.Bot size={32} />
                                            </div>
                                            <p className="font-bold text-xs uppercase tracking-widest">AI Tutor is ready to help</p>
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
            </div>
        </WebAppShell>
    );
}
