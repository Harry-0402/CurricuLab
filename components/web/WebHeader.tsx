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

    return (
        <header className="h-20 border-b border-gray-100 bg-white sticky top-0 z-30 px-8 flex items-center justify-between print:hidden">
            <div>
                <h1 className="text-sm font-medium text-gray-500 mb-0.5">Hello,</h1>
                <p className="text-lg font-bold text-gray-900">Miss Hermione Granger</p>
            </div>

            <div className="flex items-center gap-6">
                <Link
                    href="/tools/resume"
                    className="flex items-center gap-3 bg-fill-600 hover:bg-fill-700 text-black px-5 py-3 rounded-2xl shadow-lg shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <Icons.Briefcase size={18} className="text-black" />
                    </div>
                    <p className="text-sm font-bold">AI Resume Architect</p>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAnalytics(true)}
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all relative"
                    >
                        <Icons.Analytics size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                    >
                        <Icons.Settings size={20} />
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
