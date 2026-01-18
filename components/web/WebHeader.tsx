"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';
import { AnalyticsModal } from './AnalyticsModal';
import { SystemSettingsModal } from './SystemSettingsModal';

export function WebHeader() {
    const { toggleRightPanel, isRightPanelMinimized } = useAppStore();
    const [showAnalytics, setShowAnalytics] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);
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
        <header className="h-20 border-b border-gray-100 bg-white sticky top-0 z-30 px-8 flex items-center justify-between print:hidden">
            <div>
                <h1 className="text-sm font-medium text-gray-500 mb-0.5">Hello,</h1>
                <p className="text-lg font-bold text-gray-900 capitalize">{displayName}</p>
            </div>

            <div className="flex items-center gap-6">
                <Link
                    href="/tools/resume"
                    className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
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
                        href="/changelog"
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                        title="Change History"
                    >
                        <Icons.Clock size={20} />
                    </Link>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                    >
                        <Icons.Settings size={20} />
                    </button>
                    <Link
                        href="/profile"
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                        title="My Profile"
                    >
                        <Icons.User size={20} />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Sign Out"
                    >
                        <Icons.LogOut size={20} />
                    </button>
                    <button
                        onClick={toggleRightPanel}
                        className={cn(
                            "p-2.5 rounded-xl transition-all",
                            isRightPanelMinimized ? "text-gray-400 hover:text-gray-900 hover:bg-gray-50" : "text-blue-600 bg-blue-50 shadow-sm"
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
            <SystemSettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </header>
    );
}
