"use client"

import React, { useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { TracksTab } from './TracksTab';
import { ResourcesTab } from './ResourcesTab';
import { JournalTab } from './JournalTab';
import { SkillsTab } from './SkillsTab';
import { AiMentorTab } from './AiMentorTab';

type TabType = 'tracks' | 'resources' | 'journal' | 'skills' | 'ai-mentor';

const tabs = [
    { id: 'tracks' as TabType, label: 'Tracks', icon: Icons.LayoutDashboard, color: 'blue', mobileLabel: 'Tracks' },
    { id: 'resources' as TabType, label: 'Resources', icon: Icons.BookOpen, color: 'orange', mobileLabel: 'Resources' },
    { id: 'journal' as TabType, label: 'Journal', icon: Icons.FileText, color: 'green', mobileLabel: 'Journal' },
    { id: 'skills' as TabType, label: 'Skills', icon: Icons.Trophy, color: 'purple', mobileLabel: 'Skills' },
    { id: 'ai-mentor' as TabType, label: 'AI Mentor', icon: Icons.Bot, color: 'pink', mobileLabel: 'AI' },
];

const colorClasses: Record<string, { active: string; inactive: string; border: string }> = {
    blue: { active: 'bg-blue-50 text-blue-600', inactive: 'text-gray-500', border: 'border-blue-200' },
    orange: { active: 'bg-orange-50 text-orange-600', inactive: 'text-gray-500', border: 'border-orange-200' },
    green: { active: 'bg-green-50 text-green-600', inactive: 'text-gray-500', border: 'border-green-200' },
    purple: { active: 'bg-purple-50 text-purple-600', inactive: 'text-gray-500', border: 'border-purple-200' },
    pink: { active: 'bg-pink-50 text-pink-600', inactive: 'text-gray-500', border: 'border-pink-200' },
};

export function SkillForgeContent() {
    const [activeTab, setActiveTab] = useState<TabType>('tracks');

    return (
        <WebAppShell>
            <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6">

                {/* Header & Tabs */}
                <div className="flex flex-col items-start gap-4 shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Personal Growth</h1>
                        <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">SkillForge</p>
                        <p className="text-sm text-gray-500 mt-1">Master new skills beyond the curriculum</p>
                    </div>

                    <div className="w-full md:w-auto">
                        {/* Mobile: 3x2 Grid */}
                        <div className="grid grid-cols-3 gap-2 md:hidden">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const colors = colorClasses[tab.color];
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "px-3 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                                            isActive
                                                ? `${colors.active} shadow-sm border-2 ${colors.border}`
                                                : "bg-gray-50 text-gray-500 hover:text-gray-900 border-2 border-gray-100"
                                        )}
                                    >
                                        <tab.icon size={16} />
                                        <span>{tab.mobileLabel}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Desktop: Horizontal Pills */}
                        <div className="hidden md:flex p-1 bg-gray-100/80 rounded-2xl">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const colors = colorClasses[tab.color];
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                            isActive
                                                ? `bg-white ${colors.active.split(' ')[1]} shadow-sm`
                                                : "text-gray-500 hover:text-gray-900"
                                        )}
                                    >
                                        <tab.icon size={18} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="rounded-[32px] border border-gray-100 bg-white shadow-sm p-6 md:p-8">
                    {activeTab === 'tracks' && <TracksTab />}
                    {activeTab === 'resources' && <ResourcesTab />}
                    {activeTab === 'journal' && <JournalTab />}
                    {activeTab === 'skills' && <SkillsTab />}
                    {activeTab === 'ai-mentor' && <AiMentorTab />}
                </div>
            </div>

        </WebAppShell >
    );
}
