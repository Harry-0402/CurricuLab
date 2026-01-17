"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: Icons.Home },
    { label: 'My Courses', href: '/subjects', icon: Icons.Subjects },
    { label: 'Knowledge Vault', href: '/vault', icon: Icons.Notes },
    { label: 'Assignments', href: '/assignments', icon: Icons.Questions },
    { label: 'The Faculty & Fellows', href: '/faculty-fellows', icon: Icons.Users },
    { label: 'MarkWise', href: '/tools/markwise', icon: Icons.CheckSquare },
    { label: 'Team', href: '/team', icon: Icons.Profile },
];

const tools: NavItem[] = [
    { label: 'LearnPilot AI', href: '/ai-tutor', icon: Icons.Bot },
    { label: 'PaperTrail PYQs', href: '/tools/papertrail', icon: Icons.FileText },
    { label: 'Revision Notes', href: '/tools/revision', icon: Icons.Notes },
    { label: 'Digital Library', href: '/tools/resources', icon: Icons.Database },
    { label: 'Prompt Lab', href: '/tools/prompts', icon: Icons.Lightbulb },
];

export function WebSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-full border-r border-gray-100 bg-white flex flex-col sticky top-0 print:hidden">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Icons.Home size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">CurricuLab</span>
            </div>

            <div className="px-4 py-2">


                <nav className="space-y-1">
                    <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-xl transition-all",
                                    isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <nav className="space-y-1 mt-8">
                    <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tools</p>
                    {tools.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium text-sm"
                        >
                            <item.icon size={20} className="text-gray-400" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-gray-100 italic text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                CurricuLab v1.2 Beta
            </div>
        </aside>
    );
}
