"use client"

import React from 'react';
import { Icons } from '@/components/shared/Icons';

export function StudyTrackerWidget() {
    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col h-full min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Study Tracker</h3>
                <div className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-1 cursor-pointer hover:bg-gray-100">
                    This Week <Icons.ChevronDown size={12} />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-4">
                <div className="flex items-center gap-8 w-full justify-center">
                    {/* CSS mock Doughnut Chart */}
                    <div className="relative w-32 h-32 shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            {/* Background track */}
                            <path
                                className="text-gray-100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            {/* Classes (55%) - Blue */}
                            <path
                                className="text-blue-500"
                                strokeDasharray="55, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            {/* Self Study (27%) - Teal */}
                            <path
                                className="text-teal-400"
                                strokeDasharray="27, 100"
                                strokeDashoffset="-55"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            {/* Assignments (12%) - Orange */}
                            <path
                                className="text-orange-400"
                                strokeDasharray="12, 100"
                                strokeDashoffset="-82"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            {/* Revision (6%) - Purple */}
                            <path
                                className="text-purple-500"
                                strokeDasharray="6, 100"
                                strokeDashoffset="-94"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-gray-900">18.6</span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase">Total Hours</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm bg-blue-500" />
                            <span className="text-xs font-bold text-gray-700 w-20">Classes</span>
                            <span className="text-xs font-medium text-gray-500">10.2 hrs (55%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm bg-teal-400" />
                            <span className="text-xs font-bold text-gray-700 w-20">Self Study</span>
                            <span className="text-xs font-medium text-gray-500">5.1 hrs (27%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm bg-orange-400" />
                            <span className="text-xs font-bold text-gray-700 w-20">Assignments</span>
                            <span className="text-xs font-medium text-gray-500">2.3 hrs (12%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-sm bg-purple-500" />
                            <span className="text-xs font-bold text-gray-700 w-20">Revision</span>
                            <span className="text-xs font-medium text-gray-500">1.0 hr (6%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Daily Average: 2.66 hrs</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <Icons.ArrowUp size={12} /> 8.4 hrs vs last week
                </span>
            </div>
        </div>
    );
}
