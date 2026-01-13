"use client"

import { useEffect } from 'react';

/**
 * KeepAlive Component
 * Automatically reloads the page every 14 minutes in production
 * to prevent Render free tier from spinning down (15 min timeout)
 */
export function KeepAlive() {
    useEffect(() => {
        // Only run in production
        if (process.env.NODE_ENV !== 'production') {
            return;
        }

        // Set interval for 14 minutes (840,000 milliseconds)
        const FOURTEEN_MINUTES = 14 * 60 * 1000;

        const interval = setInterval(() => {
            console.log('[KeepAlive] Reloading to prevent server spin-down...');
            window.location.reload();
        }, FOURTEEN_MINUTES);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    // This component renders nothing
    return null;
}
