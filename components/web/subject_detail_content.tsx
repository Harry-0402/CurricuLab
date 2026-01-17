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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/shared/Dialog";

export default function WebSubjectDetailContent() {
    const params = useParams();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);
    // Local state for topics in the modal
    const [topicList, setTopicList] = useState<string[]>([]);
    const [newTopicInput, setNewTopicInput] = useState('');

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

    const handleEditTopics = (unit: Unit) => {
        setEditingUnit(unit);
        setTopicList(unit.topics || []);
        setNewTopicInput('');
    };

    const handleViewTopics = (unit: Unit) => {
        setViewingUnit(unit);
        setTopicList(unit.topics || []);
    };

    const handleAddTopic = () => {
        if (!newTopicInput.trim()) return;
        setTopicList([...topicList, newTopicInput.trim()]);
        setNewTopicInput('');
    };

    const handleRemoveTopic = (index: number) => {
        setTopicList(topicList.filter((_, i) => i !== index));
    };

    const handleSaveTopics = async () => {
        if (!editingUnit) return;

        const updatedUnit = { ...editingUnit, topics: topicList };

        try {
            await UnitService.update(updatedUnit);

            // Update local state
            setUnits(prev => prev.map(u => u.id === editingUnit.id ? updatedUnit : u));
            setEditingUnit(null);
        } catch (error) {
            console.error("Failed to update topics", error);
            alert("Failed to save changes.");
        }
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
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            onEditTopics={handleEditTopics}
                            onViewTopics={handleViewTopics}
                        />
                    ))}
                </div>

                {/* Edit Topics Modal */}
                <Dialog open={!!editingUnit} onOpenChange={(open) => !open && setEditingUnit(null)}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Manage Topics</DialogTitle>
                            <DialogDescription>
                                Add, edit, or remove topics for <strong>{editingUnit?.title}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="flex gap-2">
                                <input
                                    value={newTopicInput}
                                    onChange={(e) => setNewTopicInput(e.target.value)}
                                    placeholder="Add a new topic..."
                                    className="flex-1 flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                                />
                                <button
                                    onClick={handleAddTopic}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                {topicList.length === 0 ? (
                                    <p className="text-center text-gray-400 text-xs py-4">No topics added yet.</p>
                                ) : (
                                    topicList.map((topic, index) => (
                                        <div key={index} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                            <span className="text-xs font-medium text-gray-700 leading-relaxed">{topic}</span>
                                            <button
                                                onClick={() => handleRemoveTopic(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Icons.X size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <button
                                onClick={() => setEditingUnit(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTopics}
                                className="px-6 py-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                Save Changes
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
                                {topicList.length === 0 ? (
                                    <p className="text-center text-gray-400 text-sm py-4">No topics listed.</p>
                                ) : (
                                    topicList.map((topic, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-50">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                            <span className="text-sm font-medium text-gray-700 leading-relaxed">{topic}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <button
                                onClick={() => {
                                    setViewingUnit(null);
                                    if (viewingUnit) handleEditTopics(viewingUnit);
                                }}
                                className="mr-auto px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                                <Icons.Edit className="inline mr-2 h-3 w-3" />
                                Edit Topics
                            </button>
                            <button
                                onClick={() => setViewingUnit(null)}
                                className="px-6 py-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </WebAppShell>
    );
}
