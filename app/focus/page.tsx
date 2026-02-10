"use client"

import React, { useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { FocusTimer } from '@/components/web/focus/FocusTimer';
import { QuoteGenerator } from '@/components/web/focus/QuoteGenerator';
import { StatsModal } from '@/components/web/focus/StatsModal';

export default function FocusPage() {
    const [showStatsModal, setShowStatsModal] = useState(false);

    return (
        <WebAppShell>
            <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between gap-4 shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-[0.2em]">Productivity Suite</h1>
                        <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Focus Zone</p>
                        <p className="text-sm text-gray-500 mt-1">Eliminate distractions and find your flow state</p>
                    </div>
                    <button
                        onClick={() => setShowStatsModal(true)}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
                    >
                        📊 View Stats
                    </button>
                </div>

                {/* Content Area */}
                <div className="rounded-[32px] border border-gray-100 bg-white shadow-sm p-6 md:p-8 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Timer Section */}
                    <div className="flex flex-col h-full">
                        <FocusTimer onStatsRequest={setShowStatsModal} />
                    </div>

                    {/* Quote Section */}
                    <div className="flex flex-col h-full">
                        <QuoteGenerator />
                    </div>
                </div>

                {/* Stats Modal */}
                <StatsModal
                    isOpen={showStatsModal}
                    onClose={() => setShowStatsModal(false)}
                />
            </div>
        </WebAppShell>
    );
}
