import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { Assignment } from '@/types';

interface AlertsSectionProps {
    upcomingDeadlines: Assignment[];
    attendanceAlerts: { subject: string; current: number; classesNeeded: number }[];
}

export function AlertsSection({ upcomingDeadlines }: Omit<AlertsSectionProps, 'attendanceAlerts'>) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col h-[320px]">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📅</span>
                <h3 className="text-base font-black text-gray-900 tracking-tight">Upcoming Deadlines</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
                {upcomingDeadlines.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-4">
                        <p className="text-4xl mb-3">🎉</p>
                        <p className="text-sm text-gray-400 font-bold">No upcoming deadlines!</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">You're all caught up.</p>
                    </div>
                ) : (
                    upcomingDeadlines.map(assignment => {
                        const daysUntil = differenceInDays(new Date(assignment.dueDate), new Date());
                        return (
                            <div key={assignment.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100/50 hover:bg-gray-100/80 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{assignment.title}</p>
                                        <p className="text-[10px] text-gray-500 font-medium tracking-wide mt-1 uppercase">{assignment.platform || 'Assignment'}</p>
                                    </div>
                                    <div className={cn(
                                        "px-2.5 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap shadow-sm mt-0.5",
                                        daysUntil < 0 ? "bg-red-500 text-white" :
                                            daysUntil <= 2 ? "bg-red-50 text-red-600 border border-red-100" :
                                                daysUntil <= 7 ? "bg-yellow-50 text-yellow-700 border border-yellow-100" :
                                                    "bg-green-50 text-green-700 border border-green-100"
                                    )}>
                                        {daysUntil < 0 ? 'OVERDUE' : daysUntil === 0 ? 'TODAY' : `${daysUntil}d`}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
