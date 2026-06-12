"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
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
];

const careerSuite: NavItem[] = [
    { label: 'Career Gateway', href: '/tools/career', icon: Icons.Briefcase },
    { label: 'ResumeStudio', href: '/tools/resume', icon: Icons.FileText },
    { label: 'MindGrid', href: '/tools/mindgrid', icon: Icons.LayoutGrid },
];

const studyMaterials: NavItem[] = [
    { label: 'Knowledge Vault', href: '/vault', icon: Icons.Notes },
    { label: 'PaperTrail PYQs', href: '/tools/papertrail', icon: Icons.FileText },
    { label: 'Revision Notes', href: '/tools/revision', icon: Icons.Notes },
];

const community: NavItem[] = [
    { label: 'Community Forum', href: '/community', icon: Icons.Users },
    { label: 'The Faculty & Fellows', href: '/faculty-fellows', icon: Icons.GraduationCap },
    { label: 'Documentation', href: '/docs', icon: Icons.BookOpen },
];

export function WebSidebar() {
    const pathname = usePathname();
    const { user, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const renderNavGroup = (title: string, items: NavItem[]) => {
        return (
            <div key={title} className="mb-3">
                <div className="w-full flex items-center px-3 py-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {title}
                    </span>
                </div>

                <nav className="space-y-0.5">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg transition-all",
                                    isActive ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <div className="flex items-center gap-2.5">
                                    <item.icon size={18} className={isActive ? "text-indigo-600" : "text-gray-400"} />
                                    <span className="text-sm font-medium leading-none">{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        );
    };

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
                {academicSuite.length > 0 && renderNavGroup("Academic Suite", academicSuite)}
                {careerSuite.length > 0 && renderNavGroup("Career & Tools", careerSuite)}
                {studyMaterials.length > 0 && renderNavGroup("Study Materials", studyMaterials)}
                {community.length > 0 && renderNavGroup("Community", community)}
            </div>

            {/* Admin link — only for admins */}
            {isAdmin && (
                <div className="px-3 pb-2">
                    <Link
                        href="/admin"
                        className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all",
                            pathname === '/admin'
                                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                : "text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
                        )}
                    >
                        <Icons.Settings size={18} className={pathname === '/admin' ? "text-indigo-600" : "text-gray-400"} />
                        <span className="text-sm font-bold leading-none">Admin Panel</span>
                        <span className="ml-auto bg-indigo-100 text-indigo-600 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">Admin</span>
                    </Link>
                </div>
            )}

            <div className="mt-auto py-3 border-t border-gray-100 flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
                </div>
                <div className="italic text-[9px] text-gray-300 text-center uppercase tracking-widest font-bold">
                    CurricuLab v2.1
                </div>
            </div>
        </aside>
    );
}
