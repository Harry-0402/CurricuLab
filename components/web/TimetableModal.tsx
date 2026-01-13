"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import { TimetableEntry } from '@/types';
import { useAppStore } from '@/lib/store/useAppStore';
import { Icons } from '@/components/shared/Icons';

interface TimetableModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry?: TimetableEntry; // If provided, we are editing
    initialDay?: string;
    initialTime?: string;
}

export function TimetableModal({ isOpen, onClose, entry, initialDay, initialTime }: TimetableModalProps) {
    const { addTimetableEntry, updateTimetableEntry, deleteTimetableEntry } = useAppStore();

    const [formData, setFormData] = useState<Partial<TimetableEntry>>({
        day: initialDay || 'Monday',
        startTime: initialTime || '09:00 AM',
        endTime: '10:00 AM',
        subjectTitle: '',
        subjectCode: '',
        location: '',
        teacher: '',
        progress: 0
    });

    useEffect(() => {
        if (entry) {
            setFormData(entry);
        } else {
            setFormData({
                day: initialDay || 'Monday',
                startTime: initialTime || '09:00 AM',
                endTime: '10:00 AM',
                subjectTitle: '',
                subjectCode: '',
                location: '',
                teacher: '',
                progress: 0
            });
        }
    }, [entry, initialDay, initialTime, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalEntry = {
            ...formData,
            id: entry?.id || Math.random().toString(36).substr(2, 9),
        } as TimetableEntry;

        if (entry) {
            updateTimetableEntry(finalEntry);
        } else {
            addTimetableEntry(finalEntry);
        }
        onClose();
    };

    const handleDelete = () => {
        if (entry) {
            deleteTimetableEntry(entry.id);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100 shadow-sm">
                        <Icons.Calendar size={24} />
                    </div>
                    <DialogTitle>{entry ? 'Edit Session' : 'Schedule Session'}</DialogTitle>
                    <DialogDescription>
                        {entry ? 'Update the details of this existing session.' : 'Add a new subject session to your academic roadmap.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="day">Day of Week</Label>
                            <select
                                id="day"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                                value={formData.day}
                                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            >
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Start Time</Label>
                            <select
                                id="time"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            >
                                {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Subject Title</Label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Algorithms & Data Structures"
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
                            value={formData.subjectTitle}
                            onChange={(e) => setFormData({ ...formData, subjectTitle: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Subject Code</Label>
                            <input
                                id="code"
                                type="text"
                                placeholder="e.g. CS301"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
                                value={formData.subjectCode}
                                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <input
                                id="location"
                                type="text"
                                placeholder="e.g. M-18"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-300"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        {entry && (
                            <Button type="button" variant="danger" className="rounded-2xl flex-1 md:flex-none" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl flex-1 md:flex-none">
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-2xl flex-1 md:flex-none px-8">
                            {entry ? 'Update Session' : 'Save Session'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
