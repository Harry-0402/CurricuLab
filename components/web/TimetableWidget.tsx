"use client"

import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { TimetableEntry } from '@/types';
import { cn } from '@/lib/utils';
import { TimetableModal } from './TimetableModal';
import { WidgetSettingsModal } from './WidgetSettingsModal';

import { useSemester } from '@/components/providers/SemesterProvider';
import { useAuth } from '@/components/providers/AuthProvider';

interface TimetableWidgetProps {
    entries: TimetableEntry[];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = ["10:15 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

const PROGRESS_WIDTH_CLASSES: Record<number, string> = {
    0: "w-[0%]",
    5: "w-[5%]",
    10: "w-[10%]",
    15: "w-[15%]",
    20: "w-[20%]",
    25: "w-[25%]",
    30: "w-[30%]",
    35: "w-[35%]",
    40: "w-[40%]",
    45: "w-[45%]",
    50: "w-[50%]",
    55: "w-[55%]",
    60: "w-[60%]",
    65: "w-[65%]",
    70: "w-[70%]",
    75: "w-[75%]",
    80: "w-[80%]",
    85: "w-[85%]",
    90: "w-[90%]",
    95: "w-[95%]",
    100: "w-[100%]",
};

const getProgressWidthClass = (progress: number) => {
    const clamped = Math.min(100, Math.max(0, progress));
    const nearestStep = Math.round(clamped / 5) * 5;
    return PROGRESS_WIDTH_CLASSES[nearestStep as keyof typeof PROGRESS_WIDTH_CLASSES] || "w-[0%]";
};

export function TimetableWidget({ entries }: TimetableWidgetProps) {
    const { activeSemester } = useSemester();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | undefined>(undefined);
    const [initialDay, setInitialDay] = useState<string | undefined>(undefined);
    const [initialTime, setInitialTime] = useState<string | undefined>(undefined);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { user } = useAuth();

    const getEntry = (day: string, time: string) => {
        return entries.find(e => e.day === day && e.startTime === time);
    };

    const handleAdd = (day?: string, time?: string) => {
        if (!user) return;
        setInitialDay(day || 'Monday');
        setInitialTime(time || '10:15 AM');
        setSelectedEntry(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (entry: TimetableEntry) => {
        if (!user) return;
        setSelectedEntry(entry);
        setIsModalOpen(true);
    };

    const getEntryStyles = (code: string) => {
        const norm = code.toUpperCase();
        // Semester 2 mapping
        if (norm.startsWith('PBA204')) return "bg-indigo-50 text-indigo-700";
        if (norm.startsWith('PBA205')) return "bg-emerald-50 text-emerald-700";
        if (norm.startsWith('PBA206')) return "bg-rose-50 text-rose-700";
        if (norm.startsWith('PBA207')) return "bg-amber-50 text-amber-700";
        if (norm.startsWith('PBA208')) return "bg-sky-50 text-sky-700";
        if (norm.startsWith('PBA211')) return "bg-fuchsia-50 text-fuchsia-700";
        if (norm.startsWith('PBA212')) return "bg-teal-50 text-teal-700";
        if (norm.startsWith('PBA213')) return "bg-slate-100 text-slate-700";

        // Semester 3 mapping
        if (norm.startsWith('PBA301')) return "bg-emerald-50 text-emerald-700";
        if (norm.startsWith('PBA302')) return "bg-rose-50 text-rose-700";
        if (norm.startsWith('PBA303')) return "bg-indigo-50 text-indigo-700";
        if (norm.startsWith('PBA304')) return "bg-orange-50 text-orange-700";
        if (norm.startsWith('PBA309')) return "bg-sky-50 text-sky-700";
        if (norm.startsWith('PBA311')) return "bg-purple-50 text-purple-700";
        if (norm.startsWith('PBAE03')) return "bg-teal-50 text-teal-700";
        if (norm.startsWith('PBAGE')) return "bg-amber-50 text-amber-700";
        if (norm.startsWith('VAP')) return "bg-gray-100 text-gray-700";
        if (norm.startsWith('PBAG04')) return "bg-blue-50 text-blue-700";
        if (norm.startsWith('PBA312')) return "bg-blue-50 text-blue-700";

        return "bg-indigo-50 text-indigo-700";
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-row items-center justify-between gap-2 md:gap-4 shrink-0">
                <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[14px] md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 ring-2 md:ring-4 ring-blue-50 shrink-0">
                        <Icons.Calendar className="w-5 h-5 md:w-7 md:h-7" />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-3xl font-black text-gray-900 tracking-tight leading-none mb-1 md:mb-0">Academic Roadmap</h2>
                        <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[8px] md:text-[10px] font-black rounded-md uppercase tracking-wider">{activeSemester?.name ?? 'Loading...'}</span>
                            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{activeSemester?.academicYear ?? ''}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    {user && (
                        <button
                            onClick={() => handleAdd()}
                            className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-gray-900 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 group"
                        >
                            <Icons.Plus size={16} className="group-hover:rotate-90 transition-transform md:w-[18px] md:h-[18px]" />
                            <span className="hidden sm:inline">New Entry</span>
                            <span className="sm:hidden">New</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area - Integrated into the page background */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-10 overflow-hidden relative">
                {/* Background Decorations */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="overflow-hidden relative z-10">
                    <div className="w-full">
                        <div className="grid grid-cols-[40px_repeat(6,1fr)] md:grid-cols-[70px_repeat(6,1fr)] gap-2 md:gap-4 mb-4">
                            <div className="flex items-center justify-center">
                                <div className="w-px h-10 bg-gradient-to-b from-transparent via-gray-100 to-transparent" />
                            </div>
                            {DAYS.map(day => (
                                <div key={day} className="bg-gray-50/50 p-2 md:p-3 rounded-2xl text-center border border-gray-100/50">
                                    <span className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-widest block">{day.slice(0, 3)}</span>
                                    <span className="hidden md:block text-[10px] font-bold text-blue-500/60 mt-0.5 uppercase">Session</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {TIME_SLOTS.map(time => (
                                <div key={time} className="grid grid-cols-[40px_repeat(6,1fr)] md:grid-cols-[70px_repeat(6,1fr)] gap-2 md:gap-4 items-stretch group">
                                    <div className="flex items-start justify-center pt-2 md:pt-3">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] md:text-xs font-black text-gray-400 group-hover:text-blue-600 transition-colors tabular-nums">{time.split(' ')[0]}</span>
                                            <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest">{time.split(' ')[1]}</span>
                                        </div>
                                    </div>
                                    {DAYS.map(day => {
                                        const entry = getEntry(day, time);
                                        return entry ? (
                                            <div
                                                key={`${day}-${time}`}
                                                onClick={() => user && handleEdit(entry)}
                                                className={cn(
                                                    "h-full min-h-[100px] p-2 md:p-3 rounded-lg md:rounded-xl border border-transparent transition-all relative overflow-hidden flex flex-col justify-start gap-1",
                                                    user ? "hover:scale-[1.03] hover:shadow-md cursor-pointer group/item" : "cursor-default",
                                                    getEntryStyles(entry.subjectCode)
                                                )}
                                            >
                                                <div className="space-y-0.5 relative z-10">
                                                    <span className="text-[10px] font-black opacity-90 uppercase tracking-widest block">{entry.subjectCode}</span>
                                                    <h4 className="text-[10px] md:text-xs font-bold leading-snug line-clamp-2 md:line-clamp-3">{entry.subjectTitle}</h4>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                key={`${day}-${time}`}
                                                onClick={() => user && handleAdd(day, time)}
                                                        className={cn(
                                                            "h-full rounded-2xl md:rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 md:gap-2",
                                                            user ? "border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 group/empty cursor-pointer" : "border-gray-100 bg-gray-50/40 cursor-default"
                                                        )}
                                                    >
                                                        {user && (
                                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover/empty:scale-110 group-hover/empty:bg-white group-hover/empty:shadow-sm transition-all">
                                                                <Icons.Plus size={16} className="text-gray-300 group-hover/empty:text-blue-500 transition-colors" />
                                                            </div>
                                                        )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 border-t border-gray-100 relative z-10">

                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Icons.Time size={14} className="text-blue-500" />
                        <span>Sync Success: Just now</span>
                    </div>
                </div>
            </div>

            <TimetableModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                entry={selectedEntry}
                initialDay={initialDay}
                initialTime={initialTime}
            />
            <WidgetSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                widgetName="Academic Roadmap"
            />
        </div>
    );
}
