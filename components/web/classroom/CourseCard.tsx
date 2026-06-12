import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

interface CourseCardProps {
    course: any;
    matchedSubjectCode?: string;
    onSelect: (course: any) => void;
}

export default function CourseCard({ course, matchedSubjectCode, onSelect }: CourseCardProps) {
    return (
        <button
            onClick={() => onSelect(course)}
            className="group relative bg-white border border-gray-100 p-6 rounded-[30px] transition-all hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 overflow-hidden flex flex-col h-full text-left w-full min-h-[220px]"
        >
            <div className="flex items-start justify-between gap-4 mb-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icons.BookOpen size={22} />
                </div>
                {matchedSubjectCode && (
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-black text-[10px] rounded-lg border border-blue-200 shadow-sm uppercase tracking-widest">
                        {matchedSubjectCode}
                    </div>
                )}
            </div>

            <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {course.name}
                </h3>

                <div className="space-y-1">
                    {course.section ? (
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            Section: {course.section}
                        </p>
                    ) : (
                        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
                            General Class
                        </p>
                    )}

                    {course.room && (
                        <p className="text-gray-400 text-[10px] font-medium italic">
                            Room: {course.room}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-5 py-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all w-fit">
                Enter Class
                <Icons.ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-4 -right-4 text-gray-50 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                <Icons.FolderOpen size={120} />
            </div>
        </button>
    );
}
