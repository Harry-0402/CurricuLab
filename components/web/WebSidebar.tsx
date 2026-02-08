"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
}

const academicSuite: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: Icons.Home },
    { label: 'My Courses', href: '/subjects', icon: Icons.Subjects },
    { label: 'Classroom', href: '/classroom', icon: Icons.FolderOpen },
    { label: 'Assignments', href: '/assignments', icon: Icons.Questions },
    { label: 'Career Gateway', href: '/tools/career', icon: Icons.Briefcase },
];

const studyMaterials: NavItem[] = [
    { label: 'Knowledge Vault', href: '/vault', icon: Icons.Notes },
    { label: 'Digital Library', href: '/tools/resources', icon: Icons.Database },
    { label: 'PaperTrail PYQs', href: '/tools/papertrail', icon: Icons.FileText },
    { label: 'Revision Notes', href: '/tools/revision', icon: Icons.Notes },
    { label: 'MarkWise', href: '/tools/markwise', icon: Icons.CheckSquare },
];

const aiTools: NavItem[] = [
    { label: 'LearnPilot AI', href: '/ai-tutor', icon: Icons.Bot },
    { label: 'MindGrid', href: '/tools/mindgrid', icon: Icons.LayoutGrid },
    { label: 'Prompt Lab', href: '/tools/prompts', icon: Icons.Lightbulb },
];

const community: NavItem[] = [
    { label: 'Community Forum', href: '/community', icon: Icons.Users },
    { label: 'The Faculty & Fellows', href: '/faculty-fellows', icon: Icons.GraduationCap },
    { label: 'Documentation', href: '/docs', icon: Icons.BookOpen },
];

const personalGrowth: NavItem[] = [
    { label: 'SkillForge', href: '/skillforge', icon: Icons.Zap },
    { label: 'Focus Zone', href: '/focus', icon: Icons.Clock },
];

export function WebSidebar() {
    const pathname = usePathname();

    const renderNavGroup = (title: string, items: NavItem[], className?: string) => (
        <nav className={cn("space-y-0.5 mb-4", className)}>
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{title}</p>
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg transition-all",
                            isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <div className="flex items-center gap-2.5">
                            <item.icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                            <span className="text-sm font-medium leading-none">{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <aside className="w-60 h-full border-r border-gray-100 bg-white flex flex-col sticky top-0 print:hidden overflow-y-auto custom-scrollbar">
            <div className="px-6 py-5 pb-2 flex items-center gap-3 shrink-0">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0">
                    <img
                        src="/curriculab-logo.png"
                        alt="CurricuLab Logo"
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">CurricuLab</span>
            </div>

            <div className="px-3 py-3">
                {renderNavGroup("Academic Suite", academicSuite)}
                {renderNavGroup("Study Materials", studyMaterials)}
                {renderNavGroup("AI Tools", aiTools)}
                {renderNavGroup("Personal Growth", personalGrowth)}
                {renderNavGroup("Community", community)}
            </div>

            <div className="mt-auto py-1 border-t border-gray-100 italic text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                CurricuLab v1.2 Beta
            </div>
        </aside>
    );
}
