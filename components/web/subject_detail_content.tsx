"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WebAppShell } from '@/components/web/WebAppShell';
import { UnitCard } from '@/components/web/UnitCard';
import { Icons } from '@/components/shared/Icons';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { getSubjectById, getUnits } from '@/lib/services/app.service';
import { Subject, Unit } from '@/types';

export default function WebSubjectDetailContent() {
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
        <WebAppShell>
            <div className="space-y-10">
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                    <div className="space-y-4 flex-1">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">{subject.title}</h2>
                        <p className="text-lg font-bold text-gray-400 max-w-2xl leading-relaxed">{subject.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        {subject.syllabusPdfUrl && (
                            <div className="w-full sm:w-72 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Syllabus</span>
                                    <Icons.Download size={14} className="text-blue-600" />
                                </div>
                                <a
                                    href={subject.syllabusPdfUrl}
                                    download
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                >
                                    Download PDF
                                </a>
                            </div>
                        )}

                        <div className="w-full sm:w-72 space-y-3 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Course Progress</span>
                                <span className="text-sm font-black text-gray-900">{subject.progress}%</span>
                            </div>
                            <ProgressBar value={subject.progress} color={subject.color} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {units.map((unit) => (
                        <UnitCard key={unit.id} unit={unit} />
                    ))}
                </div>
            </div>
        </WebAppShell>
    );
}
