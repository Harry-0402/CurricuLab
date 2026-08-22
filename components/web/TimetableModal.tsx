"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import { TimetableEntry } from '@/types';
import { useAppStore } from '@/lib/store/useAppStore';
import { Icons } from '@/components/shared/Icons';
import * as TimetableService from '@/lib/services/timetable-service';
import { useSemester } from '@/components/providers/SemesterProvider';

interface TimetableModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry?: TimetableEntry; // If provided, we are editing
    initialDay?: string;
    initialTime?: string;
}

export function TimetableModal({ isOpen, onClose, entry, initialDay, initialTime }: TimetableModalProps) {
    const { addTimetableEntry, updateTimetableEntry, deleteTimetableEntry } = useAppStore();
    const { activeSemesterId } = useSemester();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<TimetableEntry>>({
        day: initialDay || 'Monday',
        startTime: initialTime || '10:15 AM',
        endTime: '11:00 AM',
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
                startTime: initialTime || '10:15 AM',
                endTime: '11:00 AM',
                subjectTitle: '',
                subjectCode: '',
                location: '',
                teacher: '',
                progress: 0
            });
        }
        setError(null);
    }, [entry, initialDay, initialTime, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const finalEntry = {
            ...formData,
            id: entry?.id || Math.random().toString(36).substr(2, 9),
            semesterId: activeSemesterId ?? undefined
        } as TimetableEntry;

        try {
            if (entry) {
                // Update existing entry
                await TimetableService.updateTimetableEntry(finalEntry);
                updateTimetableEntry(finalEntry);
            } else {
                // Add new entry
                await TimetableService.addTimetableEntry(finalEntry);
                addTimetableEntry(finalEntry);
            }
            onClose();
        } catch (err) {
            console.error('Error saving timetable entry:', err);
            setError(err instanceof Error ? err.message : 'Failed to save entry');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!entry) return;

        setIsLoading(true);
        setError(null);

        try {
            await TimetableService.deleteTimetableEntry(entry.id);
            deleteTimetableEntry(entry.id);
            onClose();
        } catch (err) {
            console.error('Error deleting timetable entry:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete entry');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600 mb-2 sm:mb-4 border border-blue-100 shadow-sm">
                        <Icons.Calendar size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <DialogTitle className="text-lg sm:text-xl leading-tight">{entry ? 'Edit Session' : 'Schedule Session'}</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm mt-1">
                        {entry ? 'Update the details of this existing session.' : 'Add a new subject session to your academic roadmap.'}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                        <Icons.X size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-800 font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="day" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Day of Week</Label>
                            <select
                                id="day"
                                aria-label="Select day of week"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                                value={formData.day}
                                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            >
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Start Time</Label>
                            <select
                                id="time"
                                aria-label="Select start time"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            >
                                {["10:15 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject Title</Label>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="code" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject Code</Label>
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
                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</Label>
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

                    <DialogFooter className="gap-2 pt-2">
                        {entry && (
                            <Button type="button" variant="danger" className="rounded-xl flex-1 md:flex-none py-3" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl flex-1 md:flex-none py-3 text-xs font-black uppercase tracking-widest">
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-xl flex-[2] md:flex-none px-6 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                            {entry ? 'Update Session' : 'Save Session'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
