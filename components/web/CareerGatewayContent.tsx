"use client"

import React, { useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { InterviewLineup, AIInterviewPrep, InterviewResources, JobOpenings } from './career';

export function CareerGatewayContent() {
    const [activeTab, setActiveTab] = useState<'lineup' | 'ai' | 'resources' | 'jobs'>('lineup');

    return (
        <WebAppShell>
            <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6">

                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                        <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Career Gateway</p>
                    </div>

                    <div className="grid grid-cols-2 md:flex gap-2 md:p-1 md:bg-gray-100/80 md:rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('lineup')}
                            className={cn(
                                "px-4 md:px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                activeTab === 'lineup' ? "bg-blue-50 md:bg-white text-blue-600 shadow-sm border-2 border-blue-200 md:border-0" : "bg-gray-50 md:bg-transparent text-gray-500 hover:text-gray-900 border-2 border-gray-100 md:border-0"
                            )}
                        >
                            <Icons.LayoutDashboard size={18} />
                            <span className="hidden sm:inline">Interview Lineup</span>
                            <span className="sm:hidden">Lineup</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={cn(
                                "px-4 md:px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                activeTab === 'ai' ? "bg-purple-50 md:bg-white text-purple-600 shadow-sm border-2 border-purple-200 md:border-0" : "bg-gray-50 md:bg-transparent text-gray-500 hover:text-gray-900 border-2 border-gray-100 md:border-0"
                            )}
                        >
                            <Icons.Bot size={18} />
                            <span className="hidden sm:inline">AI Prep Coach</span>
                            <span className="sm:hidden">AI Coach</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={cn(
                                "px-4 md:px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                activeTab === 'resources' ? "bg-orange-50 md:bg-white text-orange-600 shadow-sm border-2 border-orange-200 md:border-0" : "bg-gray-50 md:bg-transparent text-gray-500 hover:text-gray-900 border-2 border-gray-100 md:border-0"
                            )}
                        >
                            <Icons.Library size={18} />
                            <span>Resources</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={cn(
                                "px-4 md:px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                activeTab === 'jobs' ? "bg-green-50 md:bg-white text-green-600 shadow-sm border-2 border-green-200 md:border-0" : "bg-gray-50 md:bg-transparent text-gray-500 hover:text-gray-900 border-2 border-gray-100 md:border-0"
                            )}
                        >
                            <Icons.Briefcase size={18} />
                            <span className="hidden sm:inline">Job Openings</span>
                            <span className="sm:hidden">Jobs</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative rounded-[32px] border border-gray-100 bg-white shadow-sm p-1">
                    <div className="absolute inset-0 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        {activeTab === 'lineup' && <InterviewLineup />}
                        {activeTab === 'ai' && <AIInterviewPrep />}
                        {activeTab === 'resources' && <InterviewResources />}
                        {activeTab === 'jobs' && <JobOpenings />}
                    </div>
                </div>

            </div>
        </WebAppShell>
    );
}
