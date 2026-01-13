"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { getSubjectById, getUnits } from '@/lib/services/app.service';
import { Subject, Unit } from '@/types';

export default function MobileSubjectDetailContent() {
    const params = useParams();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);

    useEffect(() => {
        if (params.subjectId) {
            getSubjectById(params.subjectId as string).then(s => setSubject(s || null));
            getUnits(params.subjectId as string).then(setUnits);
        }
    }, [params.subjectId]);

    if (!subject) return null;

    return (
        <MobileAppShell>
            <div className="px-6 py-4 space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/subjects" className="text-blue-600 active:opacity-50 transition-opacity">
                                <Icons.ChevronLeft size={24} />
                            </Link>
                            <h2 className="text-xl font-black text-gray-900 truncate">{subject.title}</h2>
                        </div>
                        {subject.syllabusPdfUrl && (
                            <a href={subject.syllabusPdfUrl} download className="p-2.5 bg-blue-50 text-blue-600 rounded-xl active:bg-blue-600 active:text-white transition-all">
                                <Icons.Download size={20} />
                            </a>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Course Syllabus</p>
                        <span className="text-[10px] font-black text-blue-600">{subject.progress}% Complete</span>
                    </div>
                    <div className="space-y-4">
                        {units.map((u) => (
                            <Link key={u.id} href={`/unit/${u.id}`} className="block p-5 rounded-[30px] bg-white border border-gray-100 active:scale-[0.98] transition-all shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-black text-blue-600">
                                            U{u.order}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{u.title}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Explore Content</p>
                                        </div>
                                    </div>
                                    {u.isCompleted ? (
                                        <Icons.CheckSquare size={20} className="text-green-500" />
                                    ) : (
                                        <Icons.ChevronRight size={20} className="text-gray-300" />
                                    )}
                                </div>
                                {u.topics && u.topics.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 mt-2">
                                        {u.topics.slice(0, 3).map((t, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-gray-50 text-[9px] font-bold text-gray-400 rounded-lg">{t}</span>
                                        ))}
                                        {u.topics.length > 3 && (
                                            <span className="px-2.5 py-1 bg-gray-50 text-[9px] font-bold text-gray-400 rounded-lg">+{u.topics.length - 3} more</span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </MobileAppShell>
    );
}
