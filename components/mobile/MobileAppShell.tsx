import React from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileHeader } from './MobileHeader';

export function MobileAppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white pb-24">
            <MobileHeader />
            <main>
                {children}
            </main>
            <MobileBottomNav />
        </div>
    );
}
