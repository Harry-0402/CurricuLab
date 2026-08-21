"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

import { useAuth } from '@/components/providers/AuthProvider';

export function MobileBottomNav() {
    const pathname = usePathname();
    const { isAdmin } = useAuth();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const navItems = [
        { label: 'Classroom', href: '/classroom', icon: Icons.Users, activeIcon: Icons.Users },
        { label: 'Assignments', href: '/assignments', icon: Icons.CheckSquare, activeIcon: Icons.CheckSquare, badge: 6 },
        { label: 'Home', href: '/', icon: Icons.Home, activeIcon: Icons.Home },
        { label: 'Vault', href: '/vault', icon: Icons.Folder, activeIcon: Icons.Folder },
        { label: 'More', href: '#', icon: Icons.Menu, activeIcon: Icons.X },
    ];

    const baseMoreItems = [
        { label: 'Docs', href: '/docs', icon: Icons.BookOpen },
        { label: 'Faculty & Fellows', href: '/faculty-fellows', icon: Icons.GraduationCap },
        { label: 'Community', href: '/community', icon: Icons.Users },
        { label: 'Portfolio', href: '/tools/portfolio', icon: Icons.Layout },
        { label: 'ResumeStudio', href: '/tools/resume', icon: Icons.FileText },
        { label: 'Career Gateway', href: '/tools/career', icon: Icons.Briefcase },
        { label: 'MindGrid', href: '/tools/mindgrid', icon: Icons.LayoutGrid },
        { label: 'YouTube Library', href: '/youtube-library', icon: Icons.Youtube },
        { label: 'PYQs', href: '/tools/papertrail', icon: Icons.FileText },
        { label: 'My Courses', href: '/subjects', icon: Icons.Subjects },
    ];

    const moreItems = isAdmin
        ? [{ label: 'Admin Panel', href: '/admin', icon: Icons.Settings }, ...baseMoreItems]
        : baseMoreItems;

    return (
        <>
            {/* Backdrop for the 'More' menu */}
            {isMoreOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/40 z-[65] lg:hidden transition-all duration-300"
                    onClick={() => setIsMoreOpen(false)}
                />
            )}

            {/* Floating 'More' Menu Items */}
            <div className={cn(
                "fixed bottom-[90px] right-2 z-[75] flex flex-col gap-3 items-end transition-all duration-300 lg:hidden max-h-[75vh] overflow-y-auto no-scrollbar pt-4 pb-2 px-2 -mr-2",
                isMoreOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"
            )}>
                {moreItems.map((item, idx) => (
                    <Link 
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMoreOpen(false)}
                        className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800 active:scale-95 transition-transform"
                        style={{ 
                            transitionDelay: isMoreOpen ? `${(moreItems.length - 1 - idx) * 40}ms` : '0ms',
                            transform: isMoreOpen ? 'scale(1)' : 'scale(0.9)',
                            opacity: isMoreOpen ? 1 : 0,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <item.icon size={18} className="text-gray-300" />
                        <span className="font-bold text-sm tracking-wide">{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 z-[70] pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-around h-full overflow-x-auto snap-x snap-mandatory no-scrollbar px-2 w-full">
                    {navItems.map((item) => {
                        const isMoreBtn = item.label === 'More';
                        const isActive = isMoreBtn ? isMoreOpen : (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
                        const Icon = isActive ? item.activeIcon : item.icon;

                        const content = (
                            <>
                                <div className="relative">
                                    <Icon 
                                        size={24} 
                                        strokeWidth={isActive ? 2.5 : 2} 
                                        fill={isActive && !isMoreBtn ? "currentColor" : "none"}
                                        className={cn("transition-transform duration-300", isActive && "scale-110")}
                                    />
                                    {item.badge && !isMoreBtn && (
                                        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-semibold transition-all duration-300",
                                    isActive ? "font-bold text-indigo-600" : "font-medium"
                                )}>
                                    {item.label}
                                </span>
                                
                                {/* Active Indicator Line (except for More button) */}
                                {isActive && !isMoreBtn && (
                                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-indigo-600 rounded-t-full" />
                                )}
                            </>
                        );

                        if (isMoreBtn) {
                            return (
                                <button 
                                    key={item.label}
                                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center shrink-0 w-16 h-full gap-1 transition-colors snap-center",
                                        isActive ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <Link 
                                key={item.label} 
                                href={item.href}
                                className={cn(
                                    "relative flex flex-col items-center justify-center shrink-0 w-16 h-full gap-1 transition-colors snap-center",
                                    isActive ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {content}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
