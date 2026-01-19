import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { Assignment } from '@/types';

interface AlertsSectionProps {
    upcomingDeadlines: Assignment[];
    attendanceAlerts: { subject: string; current: number; classesNeeded: number }[];
}

export function AlertsSection({ upcomingDeadlines, attendanceAlerts }: AlertsSectionProps) {
    const [alertsTab, setAlertsTab] = useState<'deadlines' | 'alerts'>('deadlines');

    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            {/* Tab Switcher */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
                <button
                    onClick={() => setAlertsTab('deadlines')}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                        alertsTab === 'deadlines'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    📅 Deadlines
                </button>
                <button
                    onClick={() => setAlertsTab('alerts')}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                        alertsTab === 'alerts'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    ⚠️ Alerts
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[140px]">
                {alertsTab === 'deadlines' ? (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {upcomingDeadlines.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-2xl mb-1">🎉</p>
                                <p className="text-xs text-gray-600 font-medium">No upcoming deadlines</p>
                            </div>
                        ) : (
                            upcomingDeadlines.map(assignment => {
                                const daysUntil = differenceInDays(new Date(assignment.dueDate), new Date());
                                return (
                                    <div key={assignment.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{assignment.title}</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{assignment.platform || 'Assignment'}</p>
                                            </div>
                                            <div className={cn(
                                                "px-2 py-1 rounded-lg text-[10px] font-black whitespace-nowrap",
                                                daysUntil < 0 ? "bg-red-100 text-red-700" :
                                                    daysUntil <= 2 ? "bg-red-50 text-red-600" :
                                                        daysUntil <= 7 ? "bg-yellow-50 text-yellow-700" :
                                                            "bg-green-50 text-green-700"
                                            )}>
                                                {daysUntil < 0 ? 'OVERDUE' : daysUntil === 0 ? 'TODAY' : `${daysUntil}d`}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                        {attendanceAlerts.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-2xl mb-1">🎯</p>
                                <p className="text-xs text-gray-600 font-medium">All subjects above 75%!</p>
                            </div>
                        ) : (
                            attendanceAlerts.map((alert, idx) => (
                                <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-xl">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-bold text-gray-900">{alert.subject}</p>
                                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-black">
                                            {alert.current}%
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-red-600 font-medium">
                                        Need {alert.classesNeeded} more {alert.classesNeeded === 1 ? 'class' : 'classes'} to reach 75%
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
