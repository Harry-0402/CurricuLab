"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
// ... imports
import { getSubjects, getUnits, getNotesByUnit, createNote, getSubjectById, getUnitById } from '@/lib/services/app.service';
import { AiService } from '@/lib/services/ai-service';
import { Subject, Unit, Note } from '@/types';
import { cn } from '@/lib/utils';

export function RevisionGeneratorContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);

    useEffect(() => {
        getSubjects().then(setSubjects);
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            getUnits(selectedSubject).then(setUnits);
            setSelectedUnit('');
            setNotes([]);
        }
    }, [selectedSubject]);

    // Fetch notes when unit is selected
    const fetchNotes = async (unitId: string) => {
        setIsLoading(true);
        const data = await getNotesByUnit(unitId);
        setNotes(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (selectedUnit) {
            fetchNotes(selectedUnit);
        }
    }, [selectedUnit]);

    const handleGenerateAiNotes = async () => {
        if (!selectedUnit || !selectedSubject) return;

        setIsGenerating(true);
        setGenerationProgress(0);

        try {
            // 1. Get Context
            const unit = units.find(u => u.id === selectedUnit);
            const subject = subjects.find(s => s.id === selectedSubject);

            if (!unit || !subject || !unit.topics || unit.topics.length === 0) {
                alert("No topics found for this unit to generate notes from.");
                setIsGenerating(false);
                return;
            }

            // 2. Iterate Topics and Generate
            let completed = 0;
            for (const topic of unit.topics) {
                // Generate Content
                const content = await AiService.generateNoteContent(subject.title, unit.title, topic);

                // Save to DB
                // We use a temp ID for the type, but createNote returns the REAL note from DB.
                const tempNote: Note = {
                    id: crypto.randomUUID(),
                    unitId: selectedUnit,
                    title: topic,
                    content: content,
                    isBookmarked: false,
                    lastRead: new Date().toISOString()
                };

                const savedNote = await createNote(tempNote);

                // Progressive Update: Add to list immediately
                setNotes(prev => [savedNote, ...prev]);

                completed++;
                setGenerationProgress(Math.round((completed / unit.topics.length) * 100));
            }

            // 3. Final Refresh (Optional, but good for consistency)
            // await fetchNotes(selectedUnit); // disabled to prevent flickering, we already have the data

        } catch (error: any) {
            console.error("Failed to generate notes:", error);
            alert(`Error producing notes: ${error.message || "Unknown error"}`);
        } finally {
            setIsGenerating(false);
            setGenerationProgress(0);
        }
    };

    return (
        <WebAppShell>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                        <p className="text-5xl font-black text-gray-900 tracking-tight">Revision Notes</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Icons.FileText size={32} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Select Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Choose a subject...</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Select Unit</label>
                        <select
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            disabled={!selectedSubject}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                        >
                            <option value="">Choose a unit...</option>
                            {units.map(u => (
                                <option key={u.id} value={u.id}>Unit {u.order}: {u.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading / Generating State */}
                {isLoading || isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                        {isGenerating ? (
                            <>
                                <Icons.Sparkles size={40} className="text-blue-500 animate-pulse" />
                                <div className="text-center space-y-2">
                                    <p className="font-bold uppercase tracking-widest text-xs text-blue-600">Generating Revision Notes with AI...</p>
                                    <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                            style={{ width: `${generationProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs font-medium text-gray-400">{generationProgress}% Complete</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Icons.Clock size={40} className="animate-spin" />
                                <p className="font-bold uppercase tracking-widest text-xs">Loading notes...</p>
                            </>
                        )}
                    </div>
                ) : selectedUnit && notes.length > 0 ? (
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                                    <Icons.GraduationCap size={24} />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-gray-900">Review Cheat Sheet</p>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Condensed Summary</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 p-3 rounded-xl transition-all">
                                    <Icons.Download size={20} className="text-gray-900" />
                                    <span className="text-xs font-bold text-gray-900 uppercase">Save PDF</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-10">
                            {notes.map(note => (
                                <div key={note.id} className="space-y-4">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                        {note.title}
                                    </h3>
                                    <div className="text-gray-600 leading-relaxed text-sm bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 prose prose-blue max-w-none">
                                        {/* Simple formatting for now, could use ReactMarkdown if needed */}
                                        <div className="whitespace-pre-wrap font-medium">{note.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : selectedUnit ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400 gap-6">
                        <div className="flex flex-col items-center gap-3">
                            <Icons.Info size={32} />
                            <p className="font-bold uppercase tracking-widest text-xs">No notes found for this unit.</p>
                        </div>

                        <button
                            onClick={handleGenerateAiNotes}
                            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Icons.Sparkles size={18} className="text-blue-100 group-hover:text-white transition-colors" />
                            <span>Generate Notes with AI</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200 text-gray-400 gap-3">
                        <Icons.Lightbulb size={32} />
                        <p className="font-bold uppercase tracking-widest text-xs">Select a unit to generate a revision sheet.</p>
                    </div>
                )}
            </div>
        </WebAppShell>
    );
}
