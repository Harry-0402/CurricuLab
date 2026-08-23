import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { AdminTab } from './AdminShell';

interface AdminMobileBottomNavProps {
    activeTab: AdminTab;
    onNavigate: (tab: AdminTab) => void;
}

export function AdminMobileBottomNav({ activeTab, onNavigate }: AdminMobileBottomNavProps) {
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const navItems = [
        { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: Icons.LayoutDashboard, activeIcon: Icons.LayoutDashboard },
        { id: 'students' as AdminTab, label: 'Students', icon: Icons.Users, activeIcon: Icons.Users },
        { id: 'timetable' as AdminTab, label: 'Timetable', icon: Icons.Clock, activeIcon: Icons.Clock },
        { id: 'more' as AdminTab | 'more', label: 'More', icon: Icons.Menu, activeIcon: Icons.X },
    ];

    const moreItems = [
        { id: 'programs' as AdminTab, label: 'Programs', icon: Icons.GraduationCap },
        { id: 'semesters' as AdminTab, label: 'Semesters', icon: Icons.BookOpen },
        { id: 'subjects' as AdminTab, label: 'Subjects', icon: Icons.Subjects },
    ];

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
                    <button 
                        key={item.id}
                        onClick={() => {
                            onNavigate(item.id);
                            setIsMoreOpen(false);
                        }}
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
                    </button>
                ))}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 z-[70] pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-around h-full overflow-x-auto snap-x snap-mandatory no-scrollbar px-2 w-full">
                    {navItems.map((item) => {
                        const isMoreBtn = item.id === 'more';
                        const isActive = isMoreBtn ? isMoreOpen : (activeTab === item.id);
                        const Icon = isActive ? item.activeIcon : item.icon;

                        const content = (
                            <>
                                <div className="relative">
                                    <Icon 
                                        size={24} 
                                        strokeWidth={isActive ? 2.5 : 2} 
                                        fill={isActive && !isMoreBtn ? "currentColor" : "none"}
                                        className={cn(
                                            "transition-all duration-300 ease-out",
                                            isActive 
                                                ? "text-indigo-600 -translate-y-1 scale-110" 
                                                : "text-gray-400 group-hover:text-gray-600"
                                        )}
                                    />
                                    {isActive && !isMoreBtn && (
                                        <div className="absolute -inset-2 bg-indigo-100/50 rounded-full -z-10 animate-in zoom-in duration-300" />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold tracking-wide transition-all duration-300 mt-1.5",
                                    isActive 
                                        ? "text-indigo-600 translate-y-0 opacity-100" 
                                        : "text-gray-500 translate-y-1 opacity-70 group-hover:opacity-100"
                                )}>
                                    {item.label}
                                </span>
                            </>
                        );

                        return (
                            <button
                                key={item.id}
                                onClick={(e) => {
                                    if (isMoreBtn) {
                                        e.preventDefault();
                                        setIsMoreOpen(!isMoreOpen);
                                    } else {
                                        setIsMoreOpen(false);
                                        onNavigate(item.id as AdminTab);
                                    }
                                }}
                                className="relative flex flex-col items-center justify-center w-full h-full min-w-[72px] group snap-center pt-2 outline-none tap-highlight-transparent"
                            >
                                {content}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
