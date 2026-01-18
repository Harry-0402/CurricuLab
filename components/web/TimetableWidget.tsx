"use client"

import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { TimetableEntry } from '@/types';
import { cn } from '@/lib/utils';
import { TimetableModal } from './TimetableModal';
import { WidgetSettingsModal } from './WidgetSettingsModal';

interface TimetableWidgetProps {
    entries: TimetableEntry[];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];

export function TimetableWidget({ entries }: TimetableWidgetProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | undefined>(undefined);
    const [initialDay, setInitialDay] = useState<string | undefined>(undefined);
    const [initialTime, setInitialTime] = useState<string | undefined>(undefined);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const getEntry = (day: string, time: string) => {
        return entries.find(e => e.day === day && e.startTime === time);
    };

    const handleAdd = (day?: string, time?: string) => {
        setInitialDay(day || 'Monday');
        setInitialTime(time || '09:00 AM');
        setSelectedEntry(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (entry: TimetableEntry) => {
        setSelectedEntry(entry);
        setIsModalOpen(true);
    };

    const getEntryStyles = (code: string) => {
        if (code.startsWith('PBA204')) return "bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-indigo-100 ring-indigo-400/30";
        if (code.startsWith('PBA205')) return "bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-100 ring-emerald-400/30";
        if (code.startsWith('PBA206')) return "bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-rose-100 ring-rose-400/30";
        if (code.startsWith('PBA207')) return "bg-gradient-to-br from-amber-500 to-orange-700 text-white shadow-amber-100 ring-amber-400/30";
        if (code.startsWith('PBA208')) return "bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-sky-100 ring-sky-400/30";
        if (code.startsWith('PBA211')) return "bg-gradient-to-br from-violet-600 to-fuchsia-700 text-white shadow-fuchsia-100 ring-fuchsia-400/30";
        if (code.startsWith('PBA212')) return "bg-gradient-to-br from-teal-500 to-cyan-700 text-white shadow-teal-100 ring-teal-400/30";
        if (code.startsWith('PBA213')) return "bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-slate-100 ring-slate-400/30";
        return "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-indigo-100 ring-indigo-400/30";
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 ring-4 ring-blue-50">
                        <Icons.Calendar size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Academic Roadmap</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md uppercase tracking-wider">Semester V</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Year 2023-24</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleAdd()}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 group"
                    >
                        <Icons.Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        <span>New Entry</span>
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all shadow-none hover:shadow-sm"
                    >
                        <Icons.Settings size={22} />
                    </button>
                </div>
            </div>

            {/* Main Content Area - Integrated into the page background */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-10 overflow-hidden relative">
                {/* Background Decorations */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="overflow-hidden relative z-10">
                    <div className="w-full">
                        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
                            <div className="flex items-center justify-center">
                                <div className="w-px h-10 bg-gradient-to-b from-transparent via-gray-100 to-transparent" />
                            </div>
                            {DAYS.map(day => (
                                <div key={day} className="bg-gray-50/50 p-2 md:p-3 rounded-2xl text-center border border-gray-100/50">
                                    <span className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-tighter md:tracking-[0.2em] block">{day.slice(0, 3)}</span>
                                    <span className="hidden md:block text-[10px] font-bold text-blue-500/60 mt-0.5 uppercase">Session</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {TIME_SLOTS.map(time => (
                                <div key={time} className="grid grid-cols-7 gap-2 md:gap-4 items-stretch group">
                                    <div className="flex items-center justify-center">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] md:text-xs font-black text-gray-400 group-hover:text-blue-600 transition-colors tabular-nums">{time.split(' ')[0]}</span>
                                            <span className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-tighter">{time.split(' ')[1]}</span>
                                        </div>
                                    </div>
                                    {DAYS.map(day => {
                                        const entry = getEntry(day, time);
                                        return (
                                            <div key={`${day}-${time}`} className="relative h-full min-h-[100px]">
                                                {entry ? (
                                                    <div
                                                        onClick={() => handleEdit(entry)}
                                                        className={cn(
                                                            "h-full p-2 md:p-4 rounded-2xl md:rounded-3xl border-2 border-transparent transition-all hover:scale-[1.03] hover:shadow-2xl cursor-pointer group/item relative overflow-hidden flex flex-col justify-between shadow-lg ring-4 ring-transparent hover:ring-white",
                                                            getEntryStyles(entry.subjectCode)
                                                        )}
                                                    >
                                                        {/* Glow effect on hover */}
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />

                                                        <div className="space-y-0.5 md:space-y-1 relative z-10">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[8px] md:text-[10px] font-black opacity-80 uppercase tracking-widest">{entry.subjectCode}</span>
                                                                <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white animate-pulse" />
                                                            </div>
                                                            <h4 className="text-[10px] md:text-sm font-black leading-tight drop-shadow-sm line-clamp-2 md:line-clamp-none">{entry.subjectTitle}</h4>
                                                        </div>

                                                        <div className="mt-auto space-y-1 md:space-y-2 relative z-10">
                                                            <div className="flex items-center gap-1 md:gap-1.5">
                                                                <Icons.Trend size={10} className="opacity-70" />
                                                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-80 truncate">{entry.location}</span>
                                                            </div>
                                                            <div className="w-full h-0.5 md:h-1 bg-white/20 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                                                    style={{ width: `${entry.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => handleAdd(day, time)}
                                                        className="h-full rounded-2xl md:rounded-3xl border-2 border-dashed border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center group/empty gap-1 md:gap-2 cursor-pointer"
                                                    >
                                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover/empty:scale-110 group-hover/empty:bg-white group-hover/empty:shadow-sm transition-all">
                                                            <Icons.Plus size={16} className="text-gray-300 group-hover/empty:text-blue-500 transition-colors" />
                                                        </div>
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
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]"></div>
                            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Algorithms</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="w-3 h-3 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]"></div>
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Database</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-rose-50 rounded-2xl border border-rose-100">
                            <div className="w-3 h-3 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.4)]"></div>
                            <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Mathematics</span>
                        </div>
                    </div>
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
