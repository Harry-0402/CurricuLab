import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { TimetableEntry } from '@/types';
import { Person } from '@/lib/data/faculty-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/shared/Dialog";
import { cn } from '@/lib/utils';

interface FacultyLineupProps {
    entries: TimetableEntry[];
    faculty?: Person[];
}

export function FacultyLineup({ entries, faculty = [] }: FacultyLineupProps) {
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    // Get unique subjects with their teachers
    const uniqueSubjects = Array.from(
        new Map(
            entries.map(entry => [
                entry.subjectCode,
                {
                    code: entry.subjectCode,
                    title: entry.subjectTitle,
                    teacherName: entry.teacher
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

    const AvatarImage = ({ gender, className }: { gender: 'male' | 'female', className?: string }) => (
        <div
            className={cn("bg-no-repeat bg-cover", className)}
            style={{
                backgroundImage: 'url(/assets/faculty-avatars.jpg)',
                backgroundSize: '200% 100%',
                backgroundPosition: gender === 'male' ? '0% 0%' : '100% 0%'
            }}
        />
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Toast could be added here
    };

    return (
        <>
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
                        // Find matching faculty member - Normalize strings for better matching
                        const matchedFaculty = faculty.find(f => {
                            if (!subject.teacherName || !f.name) return false;
                            return f.name.toLowerCase().includes(subject.teacherName.toLowerCase()) ||
                                subject.teacherName.toLowerCase().includes(f.name.toLowerCase());
                        });

                        return (
                            <div
                                key={subject.code}
                                onClick={() => matchedFaculty && setSelectedPerson(matchedFaculty)}
                                className={`${colors.bg} border ${colors.border} rounded-2xl p-4 transition-all hover:shadow-md hover:scale-105 cursor-pointer relative group`}
                            >
                                <div className="flex items-start gap-3">
                                    {matchedFaculty ? (
                                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                            <AvatarImage gender={matchedFaculty.gender} className="w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className={`w-3 h-3 rounded-full ${colors.dot} shadow-md mt-1.5 flex-shrink-0`}></div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-[9px] font-black ${colors.text} uppercase tracking-wider opacity-70`}>
                                                {subject.code}
                                            </p>
                                            {matchedFaculty && (
                                                <Icons.Info size={12} className={`${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                            )}
                                        </div>
                                        <p className={`text-xs font-black ${colors.text} uppercase tracking-widest line-clamp-2 mt-1`}>
                                            {subject.title}
                                        </p>
                                        <p className="text-[11px] font-bold text-gray-500 mt-1 line-clamp-1">
                                            {matchedFaculty ? matchedFaculty.name : subject.teacherName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail Modal (Reused from FacultyFellowsContent logic) */}
            <Dialog open={!!selectedPerson} onOpenChange={(open) => !open && setSelectedPerson(null)}>
                <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[85vh] overflow-y-auto border-0 bg-white/90 backdrop-blur-xl shadow-2xl z-[100]">
                    {selectedPerson && (
                        <div className="flex flex-col items-center pt-4">
                            <div className="w-32 h-32 rounded-[3rem] bg-gray-50 border-4 border-white shadow-2xl shadow-emerald-100 p-1.5 mb-6 overflow-hidden shrink-0">
                                <AvatarImage gender={selectedPerson.gender} className="w-full h-full rounded-[2.5rem]" />
                            </div>

                            <DialogHeader className="mb-8 w-full">
                                <DialogTitle className="text-center text-2xl mb-1">{selectedPerson.name}</DialogTitle>
                                <DialogDescription asChild>
                                    <div className="text-center space-y-1">
                                        <div className="text-emerald-600 font-bold">
                                            {selectedPerson.status || 'Faculty Member'}
                                        </div>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="w-full space-y-3">
                                {/* Email */}
                                {selectedPerson.email && (
                                    <div className="p-4 bg-white hover:bg-indigo-50 rounded-2xl flex items-center justify-between group transition-colors border border-gray-100 hover:border-indigo-100 shadow-sm">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-white group-hover:text-indigo-500 transition-colors shrink-0">
                                                <Icons.Mail size={20} />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-indigo-500 transition-colors">Email</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{selectedPerson.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(selectedPerson.email)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 bg-transparent hover:bg-white rounded-xl transition-all shrink-0 border-none outline-none focus:ring-0"
                                            title="Copy Email"
                                        >
                                            <Icons.Copy size={16} />
                                        </button>
                                    </div>
                                )}
                                {/* Contact Number */}
                                {selectedPerson.contactNo && (
                                    <div className="p-4 bg-white hover:bg-emerald-50 rounded-2xl flex items-center justify-between group transition-colors border border-gray-100 hover:border-emerald-100 shadow-sm">
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-white group-hover:text-emerald-500 transition-colors shrink-0">
                                                <Icons.Profile size={20} />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-emerald-500 transition-colors">Contact</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{selectedPerson.contactNo}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(selectedPerson.contactNo)}
                                            className="p-2 text-gray-400 hover:text-emerald-600 bg-transparent hover:bg-white rounded-xl transition-all shrink-0 border-none outline-none focus:ring-0"
                                            title="Copy Contact"
                                        >
                                            <Icons.Copy size={16} />
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => window.location.href = '/faculty-fellows'}
                                    className="w-full py-3 mt-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>View All Faculty</span>
                                    <Icons.ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
