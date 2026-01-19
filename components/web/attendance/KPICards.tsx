import React from 'react';
import { Icons } from '@/components/shared/Icons';

interface KPICardsProps {
    counts: {
        totalSubjects: number;
        totalAssignments: number;
    };
}

export function KPICards({ counts }: KPICardsProps) {
    return (
        <div className="flex gap-3">
            <div className="flex-1 bg-blue-50 p-4 rounded-[20px] border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-1">Total Subjects</p>
                        <p className="text-blue-900 text-3xl font-black">{counts.totalSubjects}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Icons.BookOpen size={24} className="text-blue-600" />
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-green-50 p-4 rounded-[20px] border border-green-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest mb-1">Total Assignments</p>
                        <p className="text-green-900 text-3xl font-black">{counts.totalAssignments}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Icons.FileText size={24} className="text-green-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}
