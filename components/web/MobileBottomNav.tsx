"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { useAppStore } from '@/lib/store/useAppStore';

interface MobileBottomNavProps {
    isAnalyticaOpen?: boolean;
}

export function MobileBottomNav({ isAnalyticaOpen = false }: MobileBottomNavProps) {
    const pathname = usePathname();
    const { isAdmin } = useAuth();
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    
    // We get setAnalyticaOpen from the store directly now to trigger it
    const setAnalyticaOpen = useAppStore(state => state.setAnalyticaOpen);
    const activeSemesterId = useAppStore(state => state.activeSemesterId);
    const { user } = useAuth();
    const [incompleteCount, setIncompleteCount] = useState<number | undefined>(undefined);

    const fetchIncompleteCount = async () => {
        if (!user || !activeSemesterId) {
            setIncompleteCount(undefined);
            return;
        }
        try {
            const { getSemesterAssignments } = await import('@/lib/services/app.service');
            const { supabase } = await import('@/utils/supabase/client');
            
            const semesterAssignments = await getSemesterAssignments(activeSemesterId);
            const { data, error } = await supabase
                .from('user_completed_assignments')
                .select('assignment_id')
                .eq('user_id', user.id);
                
            if (error) throw error;
            
            const completedIds = new Set((data || []).map(d => d.assignment_id));
            const incomplete = semesterAssignments.filter(a => !completedIds.has(a.id));
            setIncompleteCount(incomplete.length > 0 ? incomplete.length : undefined);
        } catch (e) {
            console.error("Failed to load incomplete count:", e);
        }
    };

    useEffect(() => {
        fetchIncompleteCount();

        const handleUpdate = () => {
            fetchIncompleteCount();
        };

        window.addEventListener('assignments-updated', handleUpdate);
        return () => {
            window.removeEventListener('assignments-updated', handleUpdate);
        };
    }, [user, activeSemesterId]);

    const navItems = [
        { label: 'Home', href: '/', icon: Icons.Home, activeIcon: Icons.Home },
        { label: 'Assignments', href: '/assignments', icon: Icons.CheckSquare, activeIcon: Icons.CheckSquare, badge: incompleteCount },
        { label: 'Analytica', href: '#', icon: Icons.Bot, activeIcon: Icons.Bot, isAction: true },
        { label: 'Vault', href: '/vault', icon: Icons.Folder, activeIcon: Icons.Folder },
        { label: 'More', href: '#', icon: Icons.Menu, activeIcon: Icons.X },
    ];

    const baseMoreItems = [
        { label: 'Classroom', href: '/classroom', icon: Icons.Users },
        { label: 'Faculty & Fellows', href: '/faculty-fellows', icon: Icons.GraduationCap },
        { label: 'Community', href: '/community', icon: Icons.Users },
        { label: 'MindGrid', href: '/tools/mindgrid', icon: Icons.LayoutGrid },
        { label: 'YouTube Library', href: '/youtube-library', icon: Icons.Youtube },
        { label: 'PYQs', href: '/tools/papertrail', icon: Icons.FileText },
        { label: 'My Courses', href: '/subjects', icon: Icons.Subjects },
    ];

    const moreItems = isAdmin
        ? [{ label: 'Admin Panel', href: '/admin', icon: Icons.Settings }, ...baseMoreItems]
        : baseMoreItems;

    // Close the More menu whenever Analytica opens
    useEffect(() => {
        if (isAnalyticaOpen) setIsMoreOpen(false);
    }, [isAnalyticaOpen]);

    if (isAnalyticaOpen) return null;

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
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[70] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-around h-20 px-2 w-full">
                    {navItems.map((item) => {
                        const isMoreBtn = item.label === 'More';
                        const isActionBtn = item.isAction;
                        const isActive = isMoreBtn ? isMoreOpen : (item.href !== '#' && (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))));
                        const Icon = isActive ? item.activeIcon : item.icon;

                        if (isActionBtn) {
                            return (
                                <button 
                                    key={item.label}
                                    onClick={() => {
                                        setIsMoreOpen(false);
                                        setAnalyticaOpen(true);
                                    }}
                                    className="relative flex flex-col items-center justify-center shrink-0 w-16 h-full gap-1 snap-center -mt-6"
                                >
                                    <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-[0_8px_30px_rgba(79,70,229,0.4)] active:scale-90 transition-transform flex items-center justify-center border-4 border-white">
                                        <Icon size={24} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-800">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        }

                        const content = (
                            <>
                                <div className="relative">
                                    <Icon 
                                        size={24} 
                                        strokeWidth={isActive ? 2.5 : 2} 
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
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-indigo-600 rounded-full" />
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
                                onClick={() => setIsMoreOpen(false)}
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
