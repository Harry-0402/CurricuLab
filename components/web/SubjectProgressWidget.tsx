"use client"

import React from 'react';
import { Subject } from '@/types';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

interface SubjectProgressWidgetProps {
    subjects: Subject[];
}

export function SubjectProgressWidget({ subjects }: SubjectProgressWidgetProps) {
    // Generate mock progress for now since there's no real progress tracking per subject yet
    const getProgress = (id: string) => {
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 40 + (hash % 50); // Random progress between 40-90%
    };

    const getSubjectColor = (code: string) => {
        const norm = code.toUpperCase();
        if (norm.startsWith('PBA311')) return 'bg-purple-500 text-purple-600';
        if (norm.startsWith('PBAE03')) return 'bg-emerald-500 text-emerald-600';
        if (norm.startsWith('PBA304')) return 'bg-orange-500 text-orange-600';
        if (norm.startsWith('PBAG04')) return 'bg-blue-500 text-blue-600';
        if (norm.startsWith('PBA301')) return 'bg-teal-500 text-teal-600';
        if (norm.startsWith('PBA312')) return 'bg-indigo-500 text-indigo-600';
        return 'bg-indigo-500 text-indigo-600';
    };

    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col h-full min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Subject Progress</h3>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
            </div>

            <div className="space-y-5 overflow-y-auto pr-2">
                {subjects.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">No subjects enrolled.</div>
                ) : (
                    subjects.slice(0, 6).map(subject => {
                        const progress = getProgress(subject.id);
                        const colorStyles = getSubjectColor(subject.code);
                        const bgColor = colorStyles.split(' ')[0];
                        const textColor = colorStyles.split(' ')[1];

                        return (
                            <div key={subject.id} className="flex items-center gap-3">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10", textColor.replace('text-', 'bg-').replace('600', '50'))}>
                                    <Icons.Book size={14} className={textColor} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-gray-800 truncate">{subject.code} {subject.title}</h4>
                                    <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                                        <div 
                                            className={cn("h-1.5 rounded-full transition-all duration-1000", bgColor)}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">
                                    {progress}%
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
