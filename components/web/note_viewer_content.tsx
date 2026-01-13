"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WebAppShell } from '@/components/web/WebAppShell';
import { getNoteById } from '@/lib/services/app.service';
import { Note } from '@/types';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/shared/Button';
import ReactMarkdown from 'react-markdown';

export default function WebNoteViewerContent() {
    const params = useParams();
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        if (params.noteId) {
            getNoteById(params.noteId as string).then(n => setNote(n || null));
        }
    }, [params.noteId]);

    if (!note) return null;

    return (
        <WebAppShell>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3">
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm min-h-[800px]">
                        <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-50">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Study Note</p>
                                <h2 className="text-4xl font-black text-gray-900">{note.title}</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="rounded-2xl shrink-0"><Icons.Bookmark size={18} className="mr-2" /> Bookmark</Button>
                                <Button className="rounded-2xl shrink-0"><Icons.CheckSquare size={18} className="mr-2" /> Mark as Read</Button>
                            </div>
                        </div>

                        <article className="prose prose-blue max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed">
                            <ReactMarkdown>{note.content}</ReactMarkdown>
                        </article>
                    </div>
                </div>

                <div className="hidden lg:block">
                    <div className="sticky top-28 space-y-8">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Table of Contents</h3>
                            <nav className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-3 group cursor-pointer">
                                        <div className="w-1 h-4 bg-gray-100 rounded-full group-hover:bg-blue-500 transition-colors" />
                                        <span className="text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">Section {i} Title</span>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </WebAppShell>
    );
}
