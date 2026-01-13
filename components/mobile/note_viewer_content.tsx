"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { getNoteById } from '@/lib/services/app.service';
import { Note } from '@/types';
import ReactMarkdown from 'react-markdown';

export default function MobileNoteViewerContent() {
    const params = useParams();
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        if (params.noteId) {
            getNoteById(params.noteId as string).then(n => setNote(n || null));
        }
    }, [params.noteId]);

    if (!note) return null;

    return (
        <MobileAppShell>
            <div className="px-6 py-4 space-y-6">
                <div className="flex items-center justify-between">
                    <button onClick={() => window.history.back()} className="text-blue-600">
                        <Icons.ChevronRight className="rotate-180" size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400"><Icons.Bookmark size={20} /></button>
                        <button className="text-gray-400"><Icons.Trend size={20} /></button>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Study Note</p>
                    <h2 className="text-2xl font-black text-gray-900 leading-tight">{note.title}</h2>
                </div>

                <article className="prose prose-sm prose-blue max-w-none pb-10">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                </article>
            </div>
        </MobileAppShell>
    );
}
