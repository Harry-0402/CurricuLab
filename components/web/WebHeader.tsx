"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';
import { AnalyticsModal } from './AnalyticsModal';
import { SystemSettingsModal } from './SystemSettingsModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { User } from '@supabase/supabase-js';

export function WebHeader() {
    const { toggleRightPanel, isRightPanelMinimized } = useAppStore();
    const [showAnalytics, setShowAnalytics] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Initial check
        AuthService.getCurrentUser().then(setUser);

        // Listen for changes
        const { unsubscribe } = AuthService.onAuthStateChange(setUser);
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await AuthService.signOut();
        router.push('/login');
    };

    return (
        <header className="h-24 px-8 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-xl z-50 border-b border-gray-200/50">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    {user ? `Hello, ${user.email?.split('@')[0]}` : 'Hello, Guest'}
                </h1>
                <p className="text-sm font-bold text-gray-400">
                    {user ? 'Team Member' : 'CurricuLab Explorer'}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl w-96 font-bold text-gray-600 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-400 border border-gray-200">CTRL</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-400 border border-gray-200">K</span>
                    </div>
                </div>

                <div className="w-px h-10 bg-gray-200 mx-2"></div>

                {user ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAnalytics(true)}
                            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all relative"
                            title="Analytics"
                        >
                            <Icons.Analytics size={20} />
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
                            title="Settings"
                        >
                            <Icons.Settings size={20} />
                        </button>
                        <button
                            onClick={toggleRightPanel}
                            className={cn(
                                "p-3 rounded-2xl transition-all",
                                isRightPanelMinimized ? "text-gray-400 hover:text-gray-900 hover:bg-gray-50" : "text-blue-600 bg-blue-50 shadow-sm"
                            )}
                            title={isRightPanelMinimized ? "Show Side Panel" : "Hide Side Panel"}
                        >
                            <Icons.Layout size={20} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-3 bg-white border border-gray-200 rounded-2xl text-red-500 hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 shadow-sm hover:shadow-md ml-2"
                            title="Sign Out"
                        >
                            <Icons.LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Icons.LogIn size={18} />
                        Team Login
                    </Link>
                )}
            </div>

            <AnalyticsModal
                isOpen={showAnalytics}
                onClose={() => setShowAnalytics(false)}
            />
            <SystemSettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </header >
    );
}
