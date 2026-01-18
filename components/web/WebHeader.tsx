"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';
import { AnalyticsModal } from './AnalyticsModal';

export function WebHeader() {
    const { toggleRightPanel, isRightPanelMinimized } = useAppStore();
    const [showAnalytics, setShowAnalytics] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState<string | null>(null);

    const handleLogout = async () => {
        try {
            await import('@/lib/services/auth.service').then(mod => mod.AuthService.signOut());
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    React.useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await import('@/utils/supabase/client').then(mod => mod.supabase.auth.getUser());
            if (user?.email) {
                setUserEmail(user.email);
            }
        };
        fetchUser();
    }, []);

    const displayName = userEmail ? userEmail.split('@')[0] : 'Student';

    return (
        <header className="h-20 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-30 px-8 flex items-center justify-between print:hidden">
            <div>
                <h1 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Hello,</h1>
                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{displayName}</p>
            </div>

            <div className="flex items-center gap-6">
                <Link
                    href="/tools/resume"
                    className="flex items-center gap-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                >
                    <Icons.Briefcase size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Resume Architect</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAnalytics(true)}
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all relative"
                    >
                        <Icons.Analytics size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                    </button>
                    <Link
                        href="/profile"
                        className="p-2.5 text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                        title="My Profile"
                    >
                        <Icons.User size={20} />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 text-gray-400 dark:text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                        title="Sign Out"
                    >
                        <Icons.LogOut size={20} />
                    </button>
                    <button
                        onClick={toggleRightPanel}
                        className={cn(
                            "p-2.5 rounded-xl transition-all",
                            isRightPanelMinimized
                                ? "text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                : "text-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                        )}
                        title={isRightPanelMinimized ? "Show Side Panel" : "Hide Side Panel"}
                    >
                        <Icons.Layout size={20} />
                    </button>
                </div>
            </div>

            <AnalyticsModal
                isOpen={showAnalytics}
                onClose={() => setShowAnalytics(false)}
            />
        </header>
    );
}
