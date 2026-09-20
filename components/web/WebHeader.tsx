"use client"

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';
import { useSemester } from '@/components/providers/SemesterProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';


import { SemesterSwitcherModal } from './SemesterSwitcherModal';

export function WebHeader() {
    const { user, isAdmin } = useAuth();
    const [showSemesterModal, setShowSemesterModal] = useState(false);
    const pathname = usePathname();
    const { activeSemester, activeSemesterId, enrolledSemesterId, enrolledSemester, allSemesters, setActiveSemester, isBrowsing } = useSemester();

    const handleLogout = async () => {
        try {
            await import('@/lib/services/auth.service').then(mod => mod.AuthService.signOut());
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

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

    // Determine enrolled program
    const currentEnrolledSem = enrolledSemester ?? allSemesters.find(s => s.id === enrolledSemesterId);
    const enrolledProgramId = currentEnrolledSem?.programId;
    const enrolledProgramName = currentEnrolledSem?.programName;

    // Filter available semesters: if student is enrolled in a program and not an admin, only show semesters from their enrolled program
    const visibleSemesters = (!isAdmin && (enrolledProgramId || enrolledProgramName))
        ? allSemesters.filter(sem =>
            (enrolledProgramId && sem.programId === enrolledProgramId) ||
            (enrolledProgramName && sem.programName === enrolledProgramName)
        )
        : allSemesters;

    return (
        <header className="h-16 lg:h-20 border-b border-gray-100 bg-white sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between print:hidden">
            {/* Left: Logo */}
            <div className="flex items-center gap-3 lg:hidden">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                        <img src="/curriculab-logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-extrabold text-gray-900 tracking-tight hidden sm:block">CurricuLab</span>
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">

                {/* ── Semester Switcher Button ─────────────────────────────── */}
                <button
                    onClick={() => setShowSemesterModal(true)}
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

                {/* Beautiful Navigation Modal */}
                <SemesterSwitcherModal
                    isOpen={showSemesterModal}
                    onClose={() => setShowSemesterModal(false)}
                    activeSemesterId={activeSemesterId}
                    enrolledSemesterId={enrolledSemesterId}
                    semesters={visibleSemesters}
                    onSelectSemester={(id) => setActiveSemester(id)}
                    isBrowsing={isBrowsing}
                    enrolledProgramName={enrolledProgramName}
                    isAdmin={isAdmin}
                />



                {user ? (
                    <>


                        {/* Profile & Logout */}
                        <div className="flex items-center gap-3 ml-1">
                            <Link href="/profile">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm overflow-hidden relative">
                                    {user.user_metadata?.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{displayName.charAt(0)}</span>
                                    )}
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                                </div>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Sign Out"
                            >
                                <Icons.LogOut size={18} />
                            </button>
                        </div>
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
