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
    const [user, setUser] = React.useState<any>(null);
    const [isAdmin, setIsAdmin] = React.useState(false);

    React.useEffect(() => {
        let subscription: any;
        const setupAuth = async () => {
            const { supabase } = await import('@/utils/supabase/client');
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setIsAdmin(profile?.role === 'admin');
            }

            const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();
                    setIsAdmin(profile?.role === 'admin');
                } else {
                    setIsAdmin(false);
                }
            });
            subscription = data.subscription;
        };
        setupAuth();
        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    // Track collapsed state per section; Personal Growth & Community start collapsed
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
        'Academic Suite': true,
        'Study Materials': true,
        'AI Tools': true,
        'Personal Growth': false,
        'Community': false,
    });

    const toggleSection = (title: string) => {
        setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const renderNavGroup = (title: string, items: NavItem[]) => {
        const isOpen = openSections[title] ?? true;
        const hasActive = items.some(item => pathname === item.href);

        return (
            <div key={title} className="mb-3">
                <button
                    onClick={() => toggleSection(title)}
                    className={cn(
                        "w-full flex items-center justify-between px-3 py-1 rounded-lg transition-colors group",
                        hasActive && !isOpen ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest transition-colors",
                        hasActive && !isOpen ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-600"
                    )}>
                        {title}
                    </span>
                    <Icons.ChevronDown
                        size={13}
                        className={cn(
                            "transition-transform duration-200 shrink-0",
                            isOpen ? "rotate-180" : "rotate-0",
                            hasActive && !isOpen ? "text-indigo-400" : "text-gray-300 group-hover:text-gray-500"
                        )}
                    />
                </button>

                <div className={cn(
                    "overflow-hidden transition-all duration-200 ease-in-out",
                    isOpen ? "max-h-96 opacity-100 mt-0.5" : "max-h-0 opacity-0"
                )}>
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
                {studyMaterials.length > 0 && renderNavGroup("Study Materials", studyMaterials)}
                {aiTools.length > 0 && renderNavGroup("AI Tools", aiTools)}
                {personalGrowth.length > 0 && renderNavGroup("Personal Growth", personalGrowth)}
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

            <div className="mt-auto py-1 border-t border-gray-100 italic text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                CurricuLab v1.2 Beta
            </div>
        </aside>
    );
}
