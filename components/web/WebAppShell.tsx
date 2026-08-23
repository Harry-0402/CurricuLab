"use client"

import React, { useEffect, useState } from 'react';
import { WebSidebar } from './WebSidebar';
import { WebHeader } from './WebHeader';
import { MobileBottomNav } from './MobileBottomNav';

import { getUpcomingAssignments } from '@/lib/services/app.service';
import { Assignment } from '@/types';
import { Icons } from '../shared/Icons';
import { KeepAlive } from '../shared/KeepAlive';
import { RestrictedAccess } from '../shared/RestrictedAccess';
import { LastVisitManager } from '../shared/LastVisitManager';
import { usePathname } from 'next/navigation';
import { EnrollmentModal } from './EnrollmentModal';
import { useSemester } from '../providers/SemesterProvider';
import { useAuth } from '../providers/AuthProvider';
import { useAppStore } from '@/lib/store/useAppStore';
import { AnalyticaChat } from './AnalyticaChat';
import { cn } from '@/lib/utils';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


export function WebAppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Alert State
    const [dueAlerts, setDueAlerts] = useState<Assignment[]>([]);
    const [showDueAlert, setShowDueAlert] = useState(false);
    const { user, isAuthLoading } = useAuth();
    const [showEnrollment, setShowEnrollment] = useState(false);
    const { enrolledSemesterId, isLoading: isSemesterLoading, refreshEnrollment } = useSemester();
    const isAnalyticaOpen = useAppStore(state => state.isAnalyticaOpen);
    const setAnalyticaOpen = useAppStore(state => state.setAnalyticaOpen);

    // Show enrollment modal if logged in but no class_id
    useEffect(() => {
        if (!isAuthLoading && !isSemesterLoading && user && enrolledSemesterId === null) {
            setShowEnrollment(true);
        } else {
            setShowEnrollment(false);
        }
    }, [user, isAuthLoading, isSemesterLoading, enrolledSemesterId]);

    // Setup Web Push Subscriptions
    useEffect(() => {
        if (!user || typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

        const subscribeUser = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                const permission = await Notification.requestPermission();
                
                if (permission !== 'granted') return;

                const existingSubscription = await registration.pushManager.getSubscription();
                if (existingSubscription) return; // Already subscribed

                const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!publicVapidKey) return;

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                });

                await fetch('/api/push/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subscription })
                });
            } catch (error) {
                console.error("Error setting up push notifications:", error);
            }
        };

        subscribeUser();
    }, [user]);

    // Check for due assignments globally
    useEffect(() => {
        // Wait until auth and semester state are settled
        if (isAuthLoading || isSemesterLoading) return;
        // If user is logged in but not enrolled in a semester, don't show due dates
        if (user && !enrolledSemesterId) return;

        const checkDueAssignments = async () => {
            try {
                // Fetch filtered data directly from DB
                const due = await getUpcomingAssignments(2, enrolledSemesterId); // Next 2 days

                if (due.length > 0) {
                    setDueAlerts(due);
                    setShowDueAlert(true);
                    const timer = setTimeout(() => setShowDueAlert(false), 8000); // 8 seconds
                    return () => clearTimeout(timer);
                }
            } catch (error) {
                console.error("Failed to check due assignments", error);
            }
        };

        checkDueAssignments(); // Run on mount/change
        const interval = setInterval(checkDueAssignments, 5 * 60 * 1000); // Run every 5 mins

        return () => clearInterval(interval);
    }, [user, enrolledSemesterId, isAuthLoading, isSemesterLoading]);

    // --- Restricted Access Logic ---
    const publicPaths = [
        '/', '/community', '/login', '/forgot-password', '/unauthorized'
    ];
    const publicPrefixes = ['/auth/'];

    const isPublic = publicPaths.includes(pathname) || 
                     publicPrefixes.some(prefix => pathname.startsWith(prefix));

    const isRestricted = !user && !isPublic && !isAuthLoading;

    // Context-aware messages
    const getRestrictedContent = () => {
        if (pathname === '/classroom') return {
            title: "Unlock Your Classroom",
            description: "Sign in to access your Google Classroom courses, synchronized assignments, and shared resources."
        };
        if (pathname === '/assignments') return {
            title: "Manage Your Tasks",
            description: "Sign in to track your assignments, set deadlines, and sync with your academic calendar."
        };
        if (pathname === '/tools/career') return {
            title: "Career Gateway",
            description: "Access internship listings, career roadmaps, and professional networking tools by signing in."
        };
        if (pathname === '/vault') return {
            title: "Knowledge Vault",
            description: "Your personal repository of study materials and notes is just a sign-in away."
        };
        if (pathname === '/tools/revision') return {
            title: "Revision Notes",
            description: "Access curated revision notes and study guides for your subjects by signing in."
        };
        if (pathname === '/tools/papertrail') return {
            title: "PaperTrail PYQs",
            description: "Solve previous years' question papers and track your progress. Sign in to unlock all papers."
        };
        if (pathname === '/subjects' || pathname.startsWith('/subject/')) return {
            title: "Course Materials",
            description: "Sign in to access course materials, lecture notes, and syllabus details."
        };
        if (pathname === '/faculty-fellows') return {
            title: "Faculty Fellows",
            description: "Sign in to view faculty profiles, research areas, and contact information."
        };
        return {
            title: "Restricted Access",
            description: "Sign in to view the latest announcements and updates from faculty members."
        }; // Use defaults
    };

    const restrictedInfo = getRestrictedContent();

    return (
        <div className="flex h-full w-full bg-[#fafbfc] overflow-hidden pb-[env(safe-area-inset-bottom)] print:h-auto print:!overflow-visible print:bg-white">
            {user && <KeepAlive />}
            <WebSidebar />
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden print:h-auto print:!overflow-visible print:block">
                <WebHeader />
                <div className="flex-1 flex overflow-hidden min-h-0 print:h-auto print:!overflow-visible print:block pb-24 lg:pb-0">
                    <main className="flex-1 p-4 lg:p-8 overflow-y-auto no-scrollbar scroll-smooth min-w-0 print:p-0 print:!overflow-visible print:block">
                        <div className="max-w-7xl mx-auto print:max-w-none print:m-0 h-full">
                            {isRestricted ? (
                                <RestrictedAccess 
                                    {...restrictedInfo}
                                    callbackUrl={pathname}
                                />
                            ) : (
                                children
                            )}
                        </div>
                    </main>

                </div>
            </div>

            {/* Enrollment Modal — shown to authenticated users with no class assigned */}
            {showEnrollment && user && (
                <EnrollmentModal
                    userId={user.id}
                    onComplete={() => {
                        setShowEnrollment(false);
                        refreshEnrollment();
                    }}
                />
            )}

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
            
            <AnalyticaChat 
                isOpen={isAnalyticaOpen} 
                onClose={() => setAnalyticaOpen(false)} 
            />

            {/* Analytica Floating Action Button */}
            {user && (
                <button
                    onClick={() => setAnalyticaOpen(true)}
                    className={cn(
                        "flex fixed z-[60] bottom-24 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full shadow-[0_8px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.6)] items-center justify-center transition-all hover:-translate-y-1 active:scale-95 group",
                        isAnalyticaOpen && "opacity-0 pointer-events-none translate-y-10"
                    )}
                >
                    <Icons.Sparkles size={24} className="group-hover:animate-pulse" />
                    
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full border border-white/20 scale-[1.15]" />
                </button>
            )}

            {pathname !== '/admin' && !pathname.startsWith('/admin/') && (
                <MobileBottomNav isAnalyticaOpen={isAnalyticaOpen} />
            )}
        </div>
    );
}
