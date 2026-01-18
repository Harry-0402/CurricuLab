"use client"

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/services/auth.service';
import { toast } from 'sonner';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function AutoLogout() {
    const router = useRouter();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const logoutUser = async () => {
        try {
            await AuthService.signOut();
            toast.error("Session Expired", {
                description: "You have been logged out due to inactivity."
            });
            router.push('/login');
        } catch (error) {
            console.error("Auto logout failed", error);
        }
    };

    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(logoutUser, TIMEOUT_MS);
    };

    useEffect(() => {
        // Events to track activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

        // Initial start
        resetTimer();

        // Add listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    return null; // Component renders nothing
}
