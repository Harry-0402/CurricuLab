"use client"

import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store/useAppStore';

export function WebRightPanel() {
    const { isRightPanelMinimized } = useAppStore();

    const activities = [
        { id: 1, type: 'success', title: 'Graded: Week 4 Assignment', subtitle: 'Human Computer Interaction - 92/100', time: '2 hours ago', icon: Icons.Trend, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        { id: 2, type: 'info', title: 'New Assignment: Week 5', subtitle: 'Introduction to Database', time: '5 hours ago', icon: Icons.Subjects, color: 'text-blue-600 bg-blue-50 border-blue-100' },
        { id: 3, type: 'warning', title: 'Submitted: Week 3 Paper', subtitle: 'Algorithms 101', time: '2 hours ago', icon: Icons.Notes, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    ];

    const upcoming = [
        { id: 1, title: 'Paper on HCI Book by Alan Dix', subtitle: 'Human Computer Interaction', date: 'Due Sept 25', status: '1 day left', type: 'urgent' },
        { id: 2, title: 'Database Normalization Exercise', subtitle: 'Introduction to Database', date: 'Due Sept 26', status: '2 days left', type: 'pending' },
        { id: 3, title: 'Quizz: Algorithms 101', subtitle: 'Algorithms 101', date: 'Due Sept 29', status: '4 days left', type: 'pending' },
    ];

    return (
        <aside className={cn(
            "h-full border-l border-gray-100 bg-white flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shrink-0 overflow-hidden relative",
            isRightPanelMinimized ? "w-0 border-l-0" : "w-[400px]"
        )}>
            {/* Toggle Button Handle */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100/50" />

            <div className={cn(
                "w-[400px] h-full flex flex-col px-10 pt-14 pb-10 space-y-12 overflow-y-auto no-scrollbar transition-opacity duration-300",
                isRightPanelMinimized ? "opacity-0 invisible" : "opacity-100 visible"
            )}>

                {/* Recent Activity Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">Recent Activity</h4>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">View All</button>
                    </div>
                    <div className="space-y-6">
                        {activities.map(act => (
                            <div key={act.id} className="flex gap-5 group cursor-pointer">
                                <div className={cn(
                                    "w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rotate-3",
                                    act.color
                                )}>
                                    <act.icon size={22} />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className="text-sm font-black text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{act.title}</p>
                                    <p className="text-[11px] font-bold text-gray-400 line-clamp-1 mb-1.5">{act.subtitle}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-60" />
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{act.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Assignments Section */}
                <div className="space-y-8 pb-10">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-gray-900 tracking-tight text-lg font-black text-gray-900 tracking-tight">Upcoming Deadlines</h4>
                    </div>
                    <div className="space-y-5">
                        {upcoming.map(item => (
                            <div key={item.id} className="p-6 bg-white border border-gray-100/80 rounded-[35px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:border-blue-100 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                                <div className="flex items-start justify-between gap-4 relative z-10">
                                    <div className="space-y-1.5">
                                        <h5 className="text-sm font-black text-gray-900 leading-snug group-hover:text-blue-700 transition-colors pr-4">{item.title}</h5>
                                        <p className="text-[11px] font-bold text-gray-400/80">{item.subtitle}</p>
                                    </div>
                                    <div className={cn(
                                        "w-3 h-3 rounded-full mt-1 shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                                        item.type === 'urgent' ? "bg-amber-500 animate-[pulse_2s_infinite] shadow-amber-200" : "bg-blue-500 shadow-blue-100"
                                    )} />
                                </div>
                                <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-2.5 text-gray-400 group-hover:text-blue-600 transition-colors">
                                        <Icons.Calendar size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        <span>{item.date}</span>
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full",
                                        item.type === 'urgent' ? "text-amber-700 bg-amber-50" : "text-gray-400 bg-gray-50"
                                    )}>{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
