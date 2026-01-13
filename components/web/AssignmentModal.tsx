"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/shared/Dialog";
import { Icons } from "@/components/shared/Icons";
import { cn } from "@/lib/utils";
import { Assignment, Subject } from "@/types";

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assignment: Partial<Assignment>) => void;
    assignment?: Assignment | null;
    subjects: Subject[];
}

export function AssignmentModal({ isOpen, onClose, onSave, assignment, subjects }: AssignmentModalProps) {
    const [formData, setFormData] = useState<Partial<Assignment>>({
        title: '',
        description: '',
        subjectId: subjects[0]?.id || '',
        dueDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (assignment) {
            setFormData(assignment);
        } else {
            setFormData({
                title: '',
                description: '',
                subjectId: subjects[0]?.id || '',
                dueDate: new Date().toISOString().split('T')[0],
            });
        }
    }, [assignment, subjects, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <Icons.Calendar size={20} />
                        </div>
                        <div>
                            <DialogTitle>{assignment ? 'Edit Assignment' : 'New Assignment'}</DialogTitle>
                            <DialogDescription>
                                {assignment ? 'Update assignment details' : 'Add a new academic task'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Operational Efficiency Report"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                            <select
                                value={formData.subjectId}
                                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
                            >
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Due Date</label>
                            <input
                                type="date"
                                required
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What needs to be done?"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-10 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            {assignment ? 'Update Assignment' : 'Create Assignment'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
