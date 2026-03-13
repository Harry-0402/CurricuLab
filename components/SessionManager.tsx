'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { AUTH_CONFIG } from '@/lib/auth-config';

export function SessionManager() {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        let lastActivity = Date.now();
        let warningShown = false;
        let checkInterval: NodeJS.Timeout;
        let warningCountdown: NodeJS.Timeout;

        const setupAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return; // Only track activity for logged-in users

            // Track user activity
            const updateActivity = () => {
                lastActivity = Date.now();
                warningShown = false;
                setShowWarning(false);
            };

            // Activity events that reset the timer
            const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
            events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));

            // Check session periodically
            checkInterval = setInterval(async () => {
                const inactiveTime = Date.now() - lastActivity;

                // Show warning only if we are approaching the end of the 30-day window (within the last hour)
                if (inactiveTime >= AUTH_CONFIG.SESSION_TIMEOUT_MS - AUTH_CONFIG.WARNING_TIME_MS && !warningShown) {
                    setShowWarning(true);
                    warningShown = true;

                    // Update countdown every second
                    warningCountdown = setInterval(() => {
                        const remaining = AUTH_CONFIG.SESSION_TIMEOUT_MS - (Date.now() - lastActivity);
                        setTimeLeft(Math.max(0, Math.floor(remaining / 1000)));
                    }, 1000);
                }

                // Sign out only if we've actually hit the 30-day limit
                if (inactiveTime >= AUTH_CONFIG.SESSION_TIMEOUT_MS) {
                    clearInterval(warningCountdown);
                    await supabase.auth.signOut();
                    router.push('/');
                }
            }, AUTH_CONFIG.CHECK_INTERVAL_MS);

            return () => {
                clearInterval(checkInterval);
                clearInterval(warningCountdown);
                events.forEach(e => window.removeEventListener(e, updateActivity));
            };
        };

        const cleanup = setupAuth();
        return () => {
            if (typeof cleanup === 'function') (cleanup as any)();
        };
    }, [router, supabase]);

    if (showWarning) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return (
            <div className="fixed bottom-4 right-4 bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg shadow-xl z-50 max-w-sm animate-in slide-in-from-bottom-5">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Session Expiring Soon</h3>
                        <p className="text-sm text-gray-700 mt-1">
                            You'll be logged out in <span className="font-mono font-bold">{minutes}:{seconds.toString().padStart(2, '0')}</span> due to inactivity.
                        </p>
                        <button
                            onClick={() => setShowWarning(false)}
                            className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Stay Logged In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
