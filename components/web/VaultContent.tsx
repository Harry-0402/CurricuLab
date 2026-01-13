"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Subject, Note, Unit } from '@/types';
import { getSubjects, getUnits, getNotesByUnit } from '@/lib/services/app.service';
import { NoteExplorer } from './NoteExplorer';

export function VaultContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            const fetchedSubjects = await getSubjects();
            setSubjects(fetchedSubjects);
            if (fetchedSubjects.length > 0) {
                setActiveSubjectId(fetchedSubjects[0].id);
            }
            setLoading(false);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const loadNotes = async () => {
            if (!activeSubjectId) return;
            setLoading(true);
            const subjectUnits = await getUnits(activeSubjectId);
            const allNotes: Note[] = [];
            for (const unit of subjectUnits) {
                const unitNotes = await getNotesByUnit(unit.id);
                allNotes.push(...unitNotes);
            }
            setNotes(allNotes);
            setLoading(false);
        };
        loadNotes();
    }, [activeSubjectId]);

    const activeSubject = subjects.find(s => s.id === activeSubjectId);

    if (selectedNote) {
        return (
            <NoteExplorer
                note={selectedNote}
                subject={activeSubject}
                onBack={() => setSelectedNote(null)}
            />
        );
    }

    return (
        <div className="space-y-10">
            {/* Compact Subject Switcher - Single Row Optimized */}
            <div className="flex items-center gap-1.5">
                {subjects.map((subject) => {
                    const isActive = activeSubjectId === subject.id;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => setActiveSubjectId(subject.id)}
                            title={subject.title}
                            className={cn(
                                "px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1.5 border shadow-sm",
                                isActive
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                            )}
                        >
                            <span className="text-[10px] font-black tracking-widest uppercase">
                                {subject.code || subject.title.substring(0, 3)}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 bg-white rounded-full shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {activeSubject?.title}
                        </h2>
                        <p className="text-sm font-bold text-gray-400 mt-1">
                            {notes.length} Study Notes Found
                        </p>
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-100 rounded-[22px] text-xs font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                        <Icons.Search size={18} />
                        <span className="uppercase tracking-tight">Filter Vault</span>
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-72 bg-gray-100 rounded-[40px]" />
                        ))}
                    </div>
                ) : notes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="group relative bg-white border border-gray-100 p-8 rounded-[40px] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 hover:-translate-y-3 flex flex-col justify-between overflow-hidden"
                            >
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm transition-transform group-hover:rotate-12">
                                            <Icons.Notes size={22} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full">
                                            {note.lastModified}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                                            {note.title}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 line-clamp-4 leading-relaxed">
                                            {note.content}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-50/50">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setSelectedNote(note)}
                                        className="h-11 px-7 bg-blue-50 text-blue-600 rounded-[20px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 hover:bg-blue-600 hover:text-white transition-all group/btn shadow-sm active:scale-95"
                                    >
                                        Explore
                                        <Icons.ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-gray-100 rounded-[50px] p-20 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center text-gray-200">
                            <Icons.Notes size={40} />
                        </div>
                        <div className="max-w-xs">
                            <h3 className="text-xl font-black text-gray-900">Vault Empty</h3>
                            <p className="text-xs font-bold text-gray-400 leading-relaxed mt-2">
                                We couldn't find any study notes for this subject yet. Start by creating your first note!
                            </p>
                        </div>
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
                            Create First Note
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
