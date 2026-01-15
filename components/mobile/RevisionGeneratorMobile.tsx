"use client"

import React, { useState, useEffect } from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { getSubjects, getUnits, getNotesByUnit } from '@/lib/services/app.service';
import { Subject, Unit, Note } from '@/types';

export function RevisionGeneratorMobile() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        if (selectedUnit) {
            setIsLoading(true);
            getNotesByUnit(selectedUnit).then(data => {
                setNotes(data);
                setIsLoading(false);
            });
        }
    }, [selectedUnit]);

    return (
        <MobileAppShell>
            <div className="p-6 space-y-8 pb-32">
                <div>
                    <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">Revision Notes</p>
                </div>

                <div className="space-y-4 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm outline-none"
                        >
                            <option value="">Select subject...</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.code}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Unit</label>
                        <select
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            disabled={!selectedSubject}
                            className="w-full p-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm outline-none disabled:opacity-50"
                        >
                            <option value="">Select unit...</option>
                            {units.map(u => (
                                <option key={u.id} value={u.id}>Unit {u.order}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                        <Icons.Clock size={32} className="animate-spin" />
                        <p className="font-bold uppercase tracking-widest text-[10px]">Processing...</p>
                    </div>
                ) : selectedUnit && notes.length > 0 ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">Summary</h3>
                            <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
                                <Icons.Download size={20} />
                            </button>
                        </div>
                        <div className="space-y-8">
                            {notes.map(note => (
                                <div key={note.id} className="space-y-3">
                                    <div className="flex items-baseline gap-3">
                                        <div className="w-1 h-5 bg-blue-600 rounded-full" />
                                        <h4 className="text-lg font-black text-gray-900">{note.title}</h4>
                                    </div>
                                    <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none">
                                        {note.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                            <Icons.Lightbulb size={32} />
                        </div>
                        <p className="font-bold uppercase tracking-widest text-[10px] text-gray-400">
                            Select a subject and unit to generate a cheat sheet
                        </p>
                    </div>
                )}
            </div>
        </MobileAppShell>
    );
}
