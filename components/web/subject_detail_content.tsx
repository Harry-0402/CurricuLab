"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WebAppShell } from '@/components/web/WebAppShell';
import { UnitCard } from '@/components/web/UnitCard';
import { Subject, Unit } from '@/types';
import { SubjectService } from '@/lib/data/subject-service';
import { UnitService } from '@/lib/data/unit-service';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { useSemester } from '@/components/providers/SemesterProvider';
import { supabase } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/shared/Dialog";

interface SubtopicInput {
    id: string;
    title: string;
}

interface TopicInput {
    id: string;
    title: string;
    subtopics: SubtopicInput[];
}

const COLOR_OPTIONS = [
    { value: '#4f46e5', label: 'Indigo' },
    { value: '#059669', label: 'Emerald' },
    { value: '#f43f5e', label: 'Rose' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#0ea5e9', label: 'Sky' },
    { value: '#6366f1', label: 'Violet' },
    { value: '#10b981', label: 'Green' },
    { value: '#64748b', label: 'Slate' },
];

export default function WebSubjectDetailContent() {
    const params = useParams();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);
    const [topicsList, setTopicsList] = useState<TopicInput[]>([]);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const { activeSemesterId, setActiveSemester } = useSemester();

    useEffect(() => {
        if (subject && subject.semesterId && subject.semesterId !== activeSemesterId) {
            setActiveSemester(subject.semesterId);
        }
    }, [subject, activeSemesterId, setActiveSemester]);

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

    function parseTopics(rawTopics: string[]): TopicInput[] {
        const list: TopicInput[] = [];
        for (const t of rawTopics) {
            if (/^[ \t]+-/.test(t)) {
                if (list.length > 0) {
                    list[list.length - 1].subtopics.push({
                        id: Math.random().toString(36).substr(2, 9),
                        title: t.replace(/^[ \t]+-[ \t]*/, '')
                    });
                }
            } else {
                const title = t.replace(/^-[ \t]*/, '');
                list.push({ 
                    id: Math.random().toString(36).substr(2, 9), 
                    title, 
                    subtopics: [] 
                });
            }
        }
        return list;
    }

    function serializeTopics(list: TopicInput[]): string[] {
        const result: string[] = [];
        for (const topic of list) {
            if (!topic.title.trim()) continue;
            result.push(`- ${topic.title.trim()}`);
            for (const sub of topic.subtopics) {
                if (sub.title.trim()) {
                    result.push(`  - ${sub.title.trim()}`);
                }
            }
        }
        return result;
    }

    const handleViewTopics = (unit: Unit) => {
        setViewingUnit(unit);
        setTopicsList(parseTopics(unit.topics || []));
    };

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
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                    <div className="space-y-4 flex-1">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">{subject.title}</h2>
                        
                        <div className="inline-flex items-center gap-2 px-3 py-2 mt-2 rounded-xl bg-amber-50 border border-amber-100">
                            <Icons.Info size={14} className="text-amber-500 shrink-0" />
                            <p className="text-xs font-bold text-amber-700">
                                Note: The active semester is locked to this subject. To browse other semesters, return to the Courses page. Changes to subjects or units can only be made through the Admin Panel.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0 items-center">
                        {subject.syllabusPdfUrl && (
                            <div className="w-full sm:w-72 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Syllabus</span>
                                    <Icons.Download size={14} className="text-blue-600" />
                                </div>
                                <button
                                    onClick={() => setIsPreviewOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                >
                                    Preview Syllabus
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:space-y-0">
                    {units.map((unit) => (
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            onViewTopics={handleViewTopics}
                        />
                    ))}
                </div>



                {/* View Topics Modal */}
                <Dialog open={!!viewingUnit} onOpenChange={(open) => !open && setViewingUnit(null)}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Unit Topics</DialogTitle>
                            <DialogDescription>
                                Full syllabus coverage for <strong>{viewingUnit?.title}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                {topicsList.length === 0 ? (
                                    <p className="text-center text-gray-400 text-sm py-4">No topics listed.</p>
                                ) : (
                                    topicsList.map((topic, index) => (
                                        <div key={topic.id} className="flex flex-col gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                                <span className="text-sm font-medium text-gray-700 leading-relaxed">{topic.title}</span>
                                            </div>
                                            {topic.subtopics.length > 0 && (
                                                <ul className="pl-6 space-y-1.5 mt-1 border-l-2 border-indigo-100 ml-0.5">
                                                    {topic.subtopics.map((sub, j) => (
                                                        <li key={sub.id} className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                                                            <span className="shrink-0 mt-0.5">-</span>
                                                            <span className="leading-relaxed">{sub.title}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <button
                                onClick={() => setViewingUnit(null)}
                                className="px-6 py-2 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* Preview Modal */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10 shrink-0">
                            <div>
                                <DialogTitle className="text-xl font-black text-gray-900">Syllabus Preview</DialogTitle>
                                <DialogDescription className="text-xs font-bold text-gray-500 mt-1">
                                    {subject?.title}
                                </DialogDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={subject?.syllabusPdfUrl || '#'}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 text-xs font-bold"
                                    title="Download Syllabus"
                                >
                                    <Icons.Download size={16} />
                                    <span className="hidden sm:inline">Download</span>
                                </a>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <Icons.X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 w-full bg-gray-100 overflow-hidden relative">
                            {subject?.syllabusPdfUrl ? (
                                <iframe
                                    src={subject.syllabusPdfUrl}
                                    className="w-full h-full border-0 absolute inset-0"
                                    title="Syllabus Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 font-bold">
                                    No syllabus file available for preview.
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </WebAppShell>
    );
}
