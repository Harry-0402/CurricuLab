"use client"

import React from 'react';
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
                <div className="relative group w-80">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Icons.Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search subjects, notes, or questions..."
                        className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-gray-300 border border-gray-200 px-1.5 py-0.5 rounded-md">/</span>
                    </div>
                </div>

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
