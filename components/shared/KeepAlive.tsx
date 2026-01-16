"use client"

import { useEffect } from 'react';

/**
 * KeepAlive Component
 * Automatically reloads the page every 14 minutes in production
 * to prevent Render free tier from spinning down (15 min timeout)
 */
export function KeepAlive() {
    useEffect(() => {
        // Only run in production (check multiple ways for Next.js compatibility)
        const isProduction = process.env.NODE_ENV === 'production' ||
            typeof window !== 'undefined' && window.location.hostname !== 'localhost';

        if (!isProduction) {
            return;
        }

        // Set interval for 10 minutes (600,000 milliseconds)
        const TEN_MINUTES = 10 * 60 * 1000;

        const interval = setInterval(() => {
            fetch('/api/health')
                .then(res => {
                    if (res.ok) console.log('[KeepAlive] Server ping successful');
                })
                .catch(err => console.error('[KeepAlive] Ping failed:', err));
        }, TEN_MINUTES);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    // This component renders nothing
    return null;
}
