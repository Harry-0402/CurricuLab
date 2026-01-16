"use client"

import React from 'react';
import { ComponentProps } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { SubjectCard } from '@/components/web/SubjectCard';
import { Subject } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/shared/Dialog";

import { SubjectService } from '@/lib/data/subject-service';

export default function WebSubjectsContent() {
    // State
    const [subjects, setSubjects] = React.useState<Subject[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchSubjects = async () => {
        try {
            const data = await SubjectService.getAll();
            setSubjects(data);
        } catch (error) {
            console.error("Failed to load subjects", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSubjects();

        // Set up real-time subscription
        const subscription = SubjectService.subscribeToChanges(
            // onInsert: Add new subject to the list
            (newSubject) => {
                setSubjects(prev => {
                    // Avoid duplicates
                    if (prev.some(s => s.id === newSubject.id)) return prev;
                    return [...prev, newSubject];
                });
            },
            // onUpdate: Merge updated subject data
            (updatedSubject) => {
                setSubjects(prev =>
                    prev.map(s => s.id === updatedSubject.id ? updatedSubject : s)
                );
            },
            // onDelete: Remove subject from the list
            (deletedId) => {
                setSubjects(prev => prev.filter(s => s.id !== deletedId));
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);
    // Extend Partial<Subject> to include temporary form field
    const [formData, setFormData] = React.useState<Partial<Subject> & { unitsCompleted?: number }>({});

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject);
        // Calculate units completed from progress percentage
        const completed = Math.round((subject.progress / 100) * subject.unitCount);
        setFormData({ ...subject, unitsCompleted: completed });
    };

    const handleSave = async () => {
        if (!editingSubject || !formData.title || !formData.code) return;

        // Recalculate progress based on units completed
        const currentUnitCount = formData.unitCount || editingSubject.unitCount;
        const currentCompleted = formData.unitsCompleted ?? 0;

        // Ensure valid calculation
        const newProgress = currentUnitCount > 0
            ? Math.round((currentCompleted / currentUnitCount) * 100)
            : 0;

        const updatedSubject = {
            ...formData,
            progress: newProgress,
            // Remove the temporary field before saving
            unitsCompleted: undefined
        } as Subject;

        try {
            // Optimistic update
            setSubjects(prev => prev.map(sub =>
                sub.id === editingSubject.id ? { ...sub, ...updatedSubject } : sub
            ));

            // Persist to DB
            await SubjectService.update(updatedSubject);

            setEditingSubject(null);
            setFormData({});
        } catch (error) {
            console.error("Failed to update subject", error);
            // Revert changes on error (could implement more robust rollback here)
            fetchSubjects();
        }
    };

    return (
        <WebAppShell>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h2>
                    <p className="text-gray-500">Manage your subjects and track your study progress. (Dynamic Updates Active)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>

                {/* Edit Subject Modal */}
                <Dialog open={!!editingSubject} onOpenChange={(open) => !open && setEditingSubject(null)}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Subject</DialogTitle>
                            <DialogDescription>
                                Update the details for <strong>{editingSubject?.code}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Code
                                </label>
                                <input
                                    value={formData.code || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                    className="col-span-3 flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Title
                                </label>
                                <input
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="col-span-3 flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Progress Editing */}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Status
                                </label>
                                <div className="col-span-3 flex items-center gap-4">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Completed Units</p>
                                        <input
                                            type="number"
                                            min="0"
                                            max={formData.unitCount}
                                            value={formData.unitsCompleted ?? 0}
                                            onChange={(e) => setFormData(prev => ({ ...prev, unitsCompleted: parseInt(e.target.value) || 0 }))}
                                            className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Total Units</p>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.unitCount ?? 5}
                                            onChange={(e) => setFormData(prev => ({ ...prev, unitCount: parseInt(e.target.value) || 5 }))}
                                            className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="col-span-3 flex min-h-[80px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Color
                                </label>
                                <div className="col-span-3 flex gap-2">
                                    {['#4f46e5', '#059669', '#f43f5e', '#f59e0b', '#0ea5e9', '#6366f1', '#10b981', '#64748b'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <button
                                onClick={() => setEditingSubject(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                Save Changes
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </WebAppShell>
    );
}
