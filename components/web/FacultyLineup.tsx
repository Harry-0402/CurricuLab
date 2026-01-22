"use client"

import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { TimetableEntry } from '@/types';

interface FacultyLineupProps {
    entries: TimetableEntry[];
}

export function FacultyLineup({ entries }: FacultyLineupProps) {
    // Get unique subjects with their teachers
    const uniqueSubjects = Array.from(
        new Map(
            entries.map(entry => [
                entry.subjectCode,
                {
                    code: entry.subjectCode,
                    title: entry.subjectTitle,
                    teacher: entry.teacher
                }
            ])
        ).values()
    ).sort((a, b) => a.code.localeCompare(b.code));

    const getSubjectColor = (code: string) => {
        if (code.startsWith('PBA204')) return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-600' };
        if (code.startsWith('PBA205')) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-600' };
        if (code.startsWith('PBA206')) return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-600' };
        if (code.startsWith('PBA207')) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-600' };
        if (code.startsWith('PBA208')) return { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', dot: 'bg-sky-600' };
        if (code.startsWith('PBA211')) return { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-600' };
        if (code.startsWith('PBA212')) return { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', dot: 'bg-teal-600' };
        if (code.startsWith('PBA213')) return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', dot: 'bg-slate-600' };
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-600' };
    };

    return (
        <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 ring-4 ring-emerald-50">
                    <Icons.Users size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Faculty Lineup</h2>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">All {uniqueSubjects.length} Subjects & Instructors</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {uniqueSubjects.map((subject) => {
                    const colors = getSubjectColor(subject.code);
                    return (
                        <div
                            key={subject.code}
                            className={`${colors.bg} border ${colors.border} rounded-2xl p-4 transition-all hover:shadow-md hover:scale-105 cursor-pointer`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-3 h-3 rounded-full ${colors.dot} shadow-md mt-1 flex-shrink-0`}></div>
                                <div className="min-w-0">
                                    <p className={`text-xs font-black ${colors.text} uppercase tracking-widest line-clamp-2`}>
                                        {subject.title}
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-500 mt-1.5 line-clamp-2">
                                        {subject.teacher}
                                    </p>
                                    <p className={`text-[9px] font-black ${colors.text} mt-2 uppercase tracking-wider opacity-70`}>
                                        {subject.code}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
