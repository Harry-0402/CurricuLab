"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WebAppShell } from '@/components/web/WebAppShell';
import { UnitCard } from '@/components/web/UnitCard';
import { Subject, Unit } from '@/types';
import { SubjectService } from '@/lib/data/subject-service';
import { UnitService } from '@/lib/data/unit-service';
import { ProgressBar } from '@/components/shared/ProgressBar';
import * as Icons from 'lucide-react';

export default function WebSubjectDetailContent() {
    const params = useParams();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!params.subjectId) return;
            const subId = params.subjectId as string;

            setIsLoading(true);

            // Fetch Subject
            const subjectData = await SubjectService.getById(subId);
            setSubject(subjectData);

            if (subjectData) {
                // Fetch Units (this triggers auto-seeding if DB is empty)
                // Pass subject code to handle potential ID mismatches (e.g. PBA204 vs s1)
                const unitsData = await UnitService.getBySubjectId(subjectData.id, subjectData.code);
                setUnits(unitsData);
            }

            setIsLoading(false);
        };
        loadData();
    }, [params.subjectId]);

    // Light fallback generator just for truly missing subjects (s6-s8) where no static definition exists
    if (!isLoading && subject && units.length === 0) {
        // Only generate if we really have nothing
        for (let i = 1; i <= 5; i++) {
            units.push({
                id: `gen-${subject.id}-${i}`,
                subjectId: subject.id,
                title: `Unit ${i}: ${subject.title} Concepts`,
                description: "Core fundamental concepts and applications.",
                order: i,
                isCompleted: false,
                topics: ["Introduction", "Key Principles", "Case Studies", "Advanced Topics"]
            });
        }
    }

    if (isLoading) {
        return (
            <WebAppShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </WebAppShell>
        );
    }

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
