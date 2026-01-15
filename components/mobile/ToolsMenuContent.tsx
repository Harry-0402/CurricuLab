"use client"

import React from 'react';
import Link from 'next/link';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';

const tools = [
    { label: 'Revision Notes', href: '/tools/revision', icon: Icons.FileText, color: 'bg-blue-50 text-blue-600', description: 'Quick summaries for last-minute study' },
    { label: 'Digital Library', href: '/tools/resources', icon: Icons.Database, color: 'bg-emerald-50 text-emerald-600', description: 'External links and PDF resources' },
    { label: 'Prompt Lab', href: '/tools/prompts', icon: Icons.Lightbulb, color: 'bg-amber-50 text-amber-600', description: 'Optimized AI prompts for studying' },
];

export function MobileToolsMenu() {
    return (
        <MobileAppShell>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {tools.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-6 active:scale-95 transition-all shadow-sm"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.color}`}>
                                <tool.icon size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-gray-900">{tool.label}</h3>
                                <p className="text-xs text-gray-400 font-medium">{tool.description}</p>
                            </div>
                            <Icons.ChevronRight size={20} className="text-gray-300" />
                        </Link>
                    ))}
                </div>

                <div className="p-8 bg-blue-600 rounded-[40px] text-white space-y-4 shadow-xl shadow-blue-100">
                    <Icons.Bot size={32} />
                    <h3 className="text-xl font-black">LearnPilot AI</h3>
                    <p className="text-sm opacity-90 leading-relaxed font-medium">
                        Need help with a specific topic? Chat with our AI tutor for instant explanations.
                    </p>
                    <Link href="/mobile/ai-tutor" className="block w-full py-4 bg-white text-blue-600 rounded-2xl text-center font-black uppercase tracking-widest text-xs shadow-lg">
                        Launch AI Tutor
                    </Link>
                </div>
            </div>
        </MobileAppShell>
    );
}
