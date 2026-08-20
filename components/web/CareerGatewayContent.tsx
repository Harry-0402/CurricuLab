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
                <div className="flex flex-col items-start gap-4 shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em] hidden sm:block">Tools</h1>
                        <p className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Career Gateway</p>
                    </div>

                    <div className="w-full md:w-auto">
                        {/* Mobile: Dropdown */}
                        <div className="block md:hidden relative">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value as any)}
                                className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 cursor-pointer"
                            >
                                <option value="lineup">Interview Lineup</option>
                                <option value="ai">AI Prep Coach</option>
                                <option value="resources">Resources</option>
                                <option value="jobs">Job Openings</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <Icons.ChevronDown size={14} className="text-gray-400" />
                            </div>
                        </div>

                        {/* Desktop: Horizontal Pills */}
                        <div className="hidden md:flex p-1 bg-gray-100/80 rounded-2xl">
                            <button
                                onClick={() => setActiveTab('lineup')}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                    activeTab === 'lineup' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <Icons.LayoutDashboard size={18} />
                                <span>Interview Lineup</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('ai')}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                    activeTab === 'ai' ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <Icons.Bot size={18} />
                                <span>AI Prep Coach</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('resources')}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                    activeTab === 'resources' ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <Icons.Library size={18} />
                                <span>Resources</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                    activeTab === 'jobs' ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <Icons.Briefcase size={18} />
                                <span>Job Openings</span>
                            </button>
                        </div>
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
