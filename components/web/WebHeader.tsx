"use client"

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';
import { useSemester } from '@/components/providers/SemesterProvider';
import { cn } from '@/lib/utils';


export function WebHeader() {
    const [user, setUser] = React.useState<any>(null);
    const [showSemesterMenu, setShowSemesterMenu] = useState(false);
    const semesterMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { activeSemester, activeSemesterId, enrolledSemesterId, allSemesters, setActiveSemester, isBrowsing } = useSemester();

    // Close menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (semesterMenuRef.current && !semesterMenuRef.current.contains(e.target as Node)) {
                setShowSemesterMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await import('@/lib/services/auth.service').then(mod => mod.AuthService.signOut());
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    React.useEffect(() => {
        let subscription: any;

        const setupAuthListener = async () => {
            const { supabase } = await import('@/utils/supabase/client');
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);
            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });
            subscription = data.subscription;
        };

        setupAuthListener();
        return () => { if (subscription) subscription.unsubscribe(); };
    }, []);

    const getDisplayName = () => {
        if (!user) return 'Student';
        if (user.user_metadata?.full_name) return user.user_metadata.full_name;
        if (user.email) {
            const name = user.email.split('@')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return 'Student';
    };

    const displayName = getDisplayName();

    // Group semesters by program name
    const semestersByProgram = allSemesters.reduce<Record<string, typeof allSemesters>>((acc, sem) => {
        const key = sem.programName ?? 'Other';
        if (!acc[key]) acc[key] = [];
        acc[key].push(sem);
        return acc;
    }, {});

    return (
        <header className="h-20 border-b border-gray-100 bg-white sticky top-0 z-30 px-8 flex items-center justify-between print:hidden">
            <div>
                <h1 className="text-sm font-medium text-gray-500 mb-0.5">Hello,</h1>
                <p className="text-lg font-bold text-gray-900 capitalize">{user ? displayName : 'Guest'}</p>
            </div>

            <div className="flex items-center gap-2">

                {/* ── Semester Switcher ─────────────────────────────── */}
                <div className="relative" ref={semesterMenuRef}>
                    <button
                        onClick={() => setShowSemesterMenu(v => !v)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all shadow-sm text-xs font-bold active:scale-95",
                            isBrowsing
                                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}
                        title="Switch Semester"
                    >
                        <Icons.BookOpen size={15} className={isBrowsing ? "text-amber-500" : "text-indigo-500"} />
                        <span className="max-w-[120px] truncate">
                            {activeSemester?.shortName ?? 'Select Class'}
                        </span>
                        {isBrowsing && (
                            <span className="bg-amber-200 text-amber-800 text-[9px] font-black px-1 rounded-full uppercase tracking-wide">Browsing</span>
                        )}
                        <Icons.ChevronDown size={12} className="shrink-0 opacity-60" />
                    </button>

                    {showSemesterMenu && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                            <div className="p-3 border-b border-gray-50">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Switch Class</p>
                            </div>
                            <div className="max-h-64 overflow-y-auto py-1">
                                {Object.entries(semestersByProgram).map(([programName, sems]) => (
                                    <div key={programName}>
                                        <p className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">{programName}</p>
                                        {sems.map(sem => {
                                            const isActive = sem.id === activeSemesterId;
                                            const isEnrolled = sem.id === enrolledSemesterId;
                                            return (
                                                <button
                                                    key={sem.id}
                                                    onClick={() => {
                                                        setActiveSemester(sem.id);
                                                        setShowSemesterMenu(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors",
                                                        isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700"
                                                    )}
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold">{sem.shortName}</p>
                                                        <p className="text-[11px] text-gray-400">{sem.name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {isEnrolled && (
                                                            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">My Class</span>
                                                        )}
                                                        {isActive && <Icons.Check size={14} className="text-indigo-500" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                            {isBrowsing && enrolledSemesterId && (
                                <div className="p-3 border-t border-gray-100 bg-amber-50">
                                    <button
                                        onClick={() => {
                                            if (enrolledSemesterId) setActiveSemester(enrolledSemesterId);
                                            setShowSemesterMenu(false);
                                        }}
                                        className="w-full text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center justify-center gap-1 py-1"
                                    >
                                        <Icons.Home size={12} />
                                        Return to My Class
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>



                {user ? (
                    <>
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 group"
                            title="My Profile"
                        >
                            <Icons.User size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-xs font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">Profile</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-red-50 text-gray-700 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 group"
                            title="Sign Out"
                        >
                            <Icons.LogOut size={16} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                            <span className="text-xs font-bold text-gray-600 group-hover:text-red-600 transition-colors">Logout</span>
                        </button>
                    </>
                ) : (
                    <Link
                        href={`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-100 active:scale-95 group"
                    >
                        <Icons.LogIn size={16} className="text-white/80 group-hover:text-white transition-colors" />
                        <span className="text-xs font-black uppercase tracking-wider">Sign In</span>
                    </Link>
                )}
            </div>
        </header>
    );
}
