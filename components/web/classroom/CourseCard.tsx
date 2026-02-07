import React from 'react';
import { Icons } from '@/components/shared/Icons';

interface CourseCardProps {
    course: any;
    onSelect: (course: any) => void;
}

export default function CourseCard({ course, onSelect }: CourseCardProps) {
    return (
        <button
            onClick={() => onSelect(course)}
            className="group relative bg-white border border-gray-100 p-8 rounded-[40px] transition-all hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2 overflow-hidden flex flex-col h-full text-left w-full"
        >
            {/* Class Icon Decoration */}
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Icons.BookOpen size={28} />
            </div>

            <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.name}
                </h3>

                {course.section && (
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">
                        Section: {course.section}
                    </p>
                )}

                {course.room && (
                    <p className="text-gray-400 text-xs font-medium italic">
                        Room: {course.room}
                    </p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-6 py-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all w-fit">
                Enter Class
                <Icons.ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-6 -right-6 text-gray-50 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                <Icons.FolderOpen size={160} />
            </div>
        </button>
    );
}
