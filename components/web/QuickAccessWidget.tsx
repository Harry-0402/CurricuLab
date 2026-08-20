"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';

export function QuickAccessWidget({ onOpenAnalytica }: { onOpenAnalytica?: () => void }) {
    const links = [
        { name: 'My Courses', icon: 'Book', color: 'text-blue-500', bg: 'bg-blue-50', url: '/subjects' },
        { name: 'Notes', icon: 'FileText', color: 'text-purple-500', bg: 'bg-purple-50', url: '/vault' },
        { name: 'PYQs', icon: 'Archive', color: 'text-amber-500', bg: 'bg-amber-50', url: '/tools/papertrail' },
        { name: 'MindGrid', icon: 'Grid', color: 'text-indigo-500', bg: 'bg-indigo-50', url: '/tools/mindgrid' },
        { name: 'YouTube Library', icon: 'PlayCircle', color: 'text-red-500', bg: 'bg-red-50', url: '/youtube-library' },
        { name: 'Knowledge Vault', icon: 'Database', color: 'text-teal-500', bg: 'bg-teal-50', url: '/vault' },
        { name: 'ResumeStudio', icon: 'Briefcase', color: 'text-emerald-500', bg: 'bg-emerald-50', url: '/tools/resume' },
        { name: 'ERP (Attendance)', icon: 'Calendar', color: 'text-cyan-500', bg: 'bg-cyan-50', url: 'https://www.sandipuniversity.edu.in/erp-login.php', external: true },
    ];

    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h3>

            <div className="grid grid-cols-4 gap-4">
                {links.map(link => {
                    const Icon = Icons[link.icon as keyof typeof Icons];
                    return (
                        <Link
                            key={link.name}
                            href={link.url || '#'}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${link.bg} ${link.color} flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
                                <Icon size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 text-center leading-tight group-hover:text-gray-900 transition-colors">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div 
                onClick={onOpenAnalytica}
                className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between cursor-pointer group hover:shadow-md transition-shadow"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <Icons.Sparkles size={14} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-indigo-900">Ask Analytica – Your AI Study Assistant</h4>
                        <p className="text-[10px] font-medium text-indigo-600">Get doubts solved, notes, summaries & more.</p>
                    </div>
                </div>
                <Icons.ArrowRight size={16} className="text-indigo-400 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1" />
            </div>
        </div>
    );
}
