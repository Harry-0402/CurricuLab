'use client';

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Semester } from '@/types';

interface SemesterSwitcherModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeSemesterId: string | null;
    enrolledSemesterId: string | null;
    semesters: Semester[];
    onSelectSemester: (semesterId: string) => void;
    isBrowsing: boolean;
    enrolledProgramName?: string;
    isAdmin?: boolean;
}

export function SemesterSwitcherModal({
    isOpen,
    onClose,
    activeSemesterId,
    enrolledSemesterId,
    semesters,
    onSelectSemester,
    isBrowsing,
    enrolledProgramName,
    isAdmin,
}: SemesterSwitcherModalProps) {
    // Group semesters by program
    const semestersByProgram = semesters.reduce<Record<string, Semester[]>>((acc, sem) => {
        const key = sem.programName || 'General';
        if (!acc[key]) acc[key] = [];
        acc[key].push(sem);
        return acc;
    }, {});

    const programNames = Object.keys(semestersByProgram);
    
    // Default selected program tab (if multiple programs exist)
    const [selectedProgram, setSelectedProgram] = useState<string>(() => {
        if (enrolledProgramName && semestersByProgram[enrolledProgramName]) {
            return enrolledProgramName;
        }
        return programNames[0] || '';
    });

    useEffect(() => {
        if (enrolledProgramName && semestersByProgram[enrolledProgramName]) {
            setSelectedProgram(enrolledProgramName);
        } else if (programNames.length > 0 && !semestersByProgram[selectedProgram]) {
            setSelectedProgram(programNames[0]);
        }
    }, [semesters, enrolledProgramName]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const displayedSemesters = programNames.length > 1
        ? semestersByProgram[selectedProgram] || []
        : semesters;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
            {/* Backdrop click dismiss */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] z-10 animate-in zoom-in-95 duration-200">
                {/* Header with Gradient Accent */}
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
                        title="Close modal"
                    >
                        <Icons.X size={16} />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                            <Icons.GraduationCap size={22} className="text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
                                Academic Navigation
                            </span>
                            <h2 className="text-xl font-black text-white tracking-tight">
                                Switch Class & Semester
                            </h2>
                        </div>
                    </div>
                    <p className="text-xs text-indigo-100/90 mt-1 max-w-sm">
                        Select a semester to explore schedules, course subjects, and classroom materials.
                    </p>
                </div>

                {/* Program Tabs (if more than 1 program) */}
                {programNames.length > 1 && (
                    <div className="px-6 pt-4 pb-2 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                            Select Program
                        </p>
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            {programNames.map(progName => {
                                const isSelected = selectedProgram === progName;
                                const isUserProgram = enrolledProgramName === progName;
                                return (
                                    <button
                                        key={progName}
                                        onClick={() => setSelectedProgram(progName)}
                                        className={cn(
                                            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0",
                                            isSelected
                                                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100/80"
                                        )}
                                    >
                                        <span>{progName}</span>
                                        {isUserProgram && (
                                            <span className={cn(
                                                "text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase",
                                                isSelected ? "bg-indigo-500 text-white" : "bg-blue-100 text-blue-700"
                                            )}>
                                                Enrolled
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Single Program Banner (when 1 program) */}
                {programNames.length === 1 && programNames[0] && (
                    <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                                Program
                            </span>
                            <p className="text-sm font-extrabold text-gray-900">
                                {programNames[0]}
                            </p>
                        </div>
                        {enrolledProgramName === programNames[0] && (
                            <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <Icons.Check size={12} className="text-blue-600" />
                                Enrolled Program
                            </span>
                        )}
                    </div>
                )}

                {/* Semesters List */}
                <div className="p-6 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                    {displayedSemesters.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            No semesters available for this program.
                        </div>
                    ) : (
                        displayedSemesters.map(sem => {
                            const isActive = sem.id === activeSemesterId;
                            const isEnrolled = sem.id === enrolledSemesterId;

                            return (
                                <button
                                    key={sem.id}
                                    onClick={() => {
                                        onSelectSemester(sem.id);
                                        onClose();
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 text-left transition-all group relative overflow-hidden",
                                        isActive
                                            ? "border-indigo-600 bg-indigo-50/70 shadow-sm"
                                            : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50/80 bg-white"
                                    )}
                                >
                                    {/* Left Number Badge */}
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-black transition-all",
                                        isActive
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                            : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                                    )}>
                                        <span className="text-[10px] uppercase font-bold leading-none opacity-80">Sem</span>
                                        <span className="text-base font-black leading-none mt-0.5">{sem.number}</span>
                                    </div>

                                    {/* Middle info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={cn(
                                                "font-bold text-sm truncate",
                                                isActive ? "text-indigo-900" : "text-gray-900 group-hover:text-indigo-600"
                                            )}>
                                                {sem.shortName}
                                            </p>
                                            {isEnrolled && (
                                                <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                                    <Icons.Home size={10} />
                                                    My Class
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {sem.name}
                                        </p>
                                        {sem.academicYear && (
                                            <span className="text-[10px] font-semibold text-gray-400">
                                                AY {sem.academicYear}
                                            </span>
                                        )}
                                    </div>

                                    {/* Right Check / Action */}
                                    <div className="shrink-0 flex items-center gap-2">
                                        {isActive ? (
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                                                <Icons.Check size={16} />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                                                <Icons.ChevronRight size={16} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer / Return to My Class */}
                {isBrowsing && enrolledSemesterId && (
                    <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                            <Icons.AlertTriangle size={16} className="text-amber-600 shrink-0" />
                            <span>Currently browsing another class</span>
                        </div>
                        <button
                            onClick={() => {
                                onSelectSemester(enrolledSemesterId);
                                onClose();
                            }}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
                        >
                            <Icons.Home size={13} />
                            <span>Return to My Class</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
