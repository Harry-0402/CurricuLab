"use client"

import React, { useEffect, useState } from 'react';
import { WebSidebar } from './WebSidebar';
import { WebHeader } from './WebHeader';
import { WebRightPanel } from './WebRightPanel';
import { getUpcomingAssignments } from '@/lib/services/app.service';
import { Assignment } from '@/types';
import { Icons } from '../shared/Icons';

export function WebAppShell({ children }: { children: React.ReactNode }) {
    // Alert State
    const [dueAlerts, setDueAlerts] = useState<Assignment[]>([]);
    const [showDueAlert, setShowDueAlert] = useState(false);

    // Auto-reload every 14 minutes (14 * 60 * 1000 ms)
    useEffect(() => {
        const AUTO_RELOAD_INTERVAL = 14 * 60 * 1000;

        const intervalId = setInterval(() => {
            window.location.reload();
        }, AUTO_RELOAD_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);

    // Check for due assignments globally
    useEffect(() => {
        const checkDueAssignments = async () => {
            try {
                // Fetch filtered data directly from DB
                const due = await getUpcomingAssignments(2); // Next 2 days

                if (due.length > 0) {
                    setDueAlerts(due);
                    setShowDueAlert(true);
                    const timer = setTimeout(() => setShowDueAlert(false), 20000); // 20 seconds
                    return () => clearTimeout(timer);
                }
            } catch (error) {
                console.error("Failed to check due assignments", error);
            }
        };

        checkDueAssignments(); // Run on mount
        const interval = setInterval(checkDueAssignments, 5 * 60 * 1000); // Run every 5 mins

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-full w-full bg-[#fafbfc] overflow-hidden pb-[env(safe-area-inset-bottom)] print:h-auto print:!overflow-visible print:bg-white">
            <WebSidebar />
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden print:h-auto print:!overflow-visible print:block">
                <WebHeader />
                <div className="flex-1 flex overflow-hidden min-h-0 print:h-auto print:!overflow-visible print:block">
                    <main className="flex-1 p-8 overflow-y-auto no-scrollbar scroll-smooth min-w-0 print:p-0 print:!overflow-visible print:block">
                        <div className="max-w-7xl mx-auto print:max-w-none print:m-0">
                            {children}
                        </div>
                    </main>
                    <WebRightPanel />
                </div>
            </div>

            {/* Global Due Date Alert Popup */}
            {showDueAlert && dueAlerts.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-5 max-w-sm w-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
                        <button
                            onClick={() => setShowDueAlert(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Icons.X size={16} />
                        </button>

                        <div className="pl-4">
                            <div className="flex items-center gap-2 mb-2 text-red-600">
                                <Icons.AlertTriangle size={20} className="animate-pulse" />
                                <h4 className="font-bold text-sm uppercase tracking-wide">Due Soon</h4>
                            </div>
                            <p className="text-gray-600 text-xs font-medium mb-3">
                                You have {dueAlerts.length} assignment{dueAlerts.length > 1 ? 's' : ''} due within the next 2 days:
                            </p>
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 no-scrollbar">
                                {dueAlerts.map(alert => (
                                    <div key={alert.id} className="bg-red-50 rounded-lg p-2 border border-red-100">
                                        <p className="font-bold text-gray-800 text-xs truncate">{alert.title}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[10px] text-red-500 font-bold">{alert.dueDate}</span>
                                            {alert.platform && (
                                                <span className="text-[9px] bg-white px-1.5 py-0.5 rounded text-gray-500 border border-red-100">{alert.platform}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
