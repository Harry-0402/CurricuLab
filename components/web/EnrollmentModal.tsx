'use client';

import React, { useState, useEffect } from 'react';
import { Program, Semester } from '@/types';
import { getPrograms, getSemesters } from '@/lib/services/semester-service';
import { updateUserEnrollment } from '@/lib/services/enrollment-service';
import { useSemester } from '@/components/providers/SemesterProvider';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

interface EnrollmentModalProps {
    userId: string;
    onComplete: () => void;
}

export function EnrollmentModal({ userId, onComplete }: EnrollmentModalProps) {
    const [step, setStep] = useState<'program' | 'semester'>('program');
    const [programs, setPrograms] = useState<Program[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { refreshEnrollment, setActiveSemester } = useSemester();

    useEffect(() => {
        getPrograms().then(data => {
            setPrograms(data);
            setIsLoading(false);
        });
    }, []);

    const handleSelectProgram = async (program: Program) => {
        setSelectedProgram(program);
        setIsLoading(true);
        const data = await getSemesters(program.id);
        // Only show active semesters for enrollment
        setSemesters(data.filter(s => s.isActive));
        setIsLoading(false);
        setStep('semester');
    };

    const handleConfirm = async () => {
        if (!selectedSemester) return;
        setIsSaving(true);
        const success = await updateUserEnrollment(userId, selectedSemester.id);
        if (success) {
            setActiveSemester(selectedSemester.id);
            await refreshEnrollment();
            onComplete();
        }
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-6 sm:p-8 text-white">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Icons.GraduationCap size={20} className="text-white sm:w-[22px] sm:h-[22px]" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/70">Welcome to CurricuLab</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black mb-1">Select Your Class</h2>
                    <p className="text-white/70 text-xs sm:text-sm">
                        {step === 'program'
                            ? 'Which program are you enrolled in?'
                            : `Great! Now pick your semester in ${selectedProgram?.name}.`
                        }
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className={cn("h-1.5 rounded-full flex-1 transition-all", step === 'program' ? 'bg-white' : 'bg-white/40')} />
                        <div className={cn("h-1.5 rounded-full flex-1 transition-all", step === 'semester' ? 'bg-white' : 'bg-white/40')} />
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : step === 'program' ? (
                        <div className="space-y-2.5 sm:space-y-3">
                            {programs.length === 0 ? (
                                <p className="text-center text-gray-400 py-8 text-sm">No programs available. Contact admin.</p>
                            ) : programs.map(program => (
                                <button
                                    key={program.id}
                                    onClick={() => handleSelectProgram(program)}
                                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors shrink-0">
                                        <Icons.GraduationCap size={20} className="text-indigo-600 sm:w-[22px] sm:h-[22px]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{program.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-400 font-mono">{program.code}</p>
                                        {program.description && (
                                            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">{program.description}</p>
                                        )}
                                    </div>
                                    <Icons.ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2.5 sm:space-y-3">
                            <button
                                onClick={() => { setStep('program'); setSelectedSemester(null); }}
                                className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-gray-700 transition-colors mb-2"
                            >
                                <Icons.ChevronLeft size={14} />
                                Back to Programs
                            </button>

                            {semesters.length === 0 ? (
                                <p className="text-center text-gray-400 py-8 text-sm">No active semesters in this program. Contact admin.</p>
                            ) : semesters.map(sem => (
                                <button
                                    key={sem.id}
                                    onClick={() => setSelectedSemester(sem)}
                                    className={cn(
                                        "w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 transition-all text-left group",
                                        selectedSemester?.id === sem.id
                                            ? "border-indigo-500 bg-indigo-50"
                                            : "border-gray-100 hover:border-indigo-300 hover:bg-indigo-50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                        selectedSemester?.id === sem.id ? "bg-indigo-500" : "bg-gray-100 group-hover:bg-indigo-200"
                                    )}>
                                        <span className={cn("font-black text-base sm:text-lg", selectedSemester?.id === sem.id ? "text-white" : "text-gray-500")}>
                                            {sem.number}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{sem.shortName}</p>
                                        <p className="text-xs sm:text-sm text-gray-400 truncate">{sem.name}</p>
                                        {sem.academicYear && (
                                            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">AY {sem.academicYear}</p>
                                        )}
                                    </div>
                                    {selectedSemester?.id === sem.id && (
                                        <Icons.Check size={18} className="text-indigo-600 shrink-0" />
                                    )}
                                </button>
                            ))}

                            <button
                                onClick={handleConfirm}
                                disabled={!selectedSemester || isSaving}
                                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95 uppercase tracking-widest"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Icons.Check size={16} />
                                        Confirm Enrollment
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
