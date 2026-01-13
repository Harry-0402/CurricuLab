"use client"

import { useEffect, useState } from 'react';
import { SearchContent } from '@/components/shared/SearchContent';
import { WebAppShell } from '@/components/web/WebAppShell';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';

export default function SearchPage() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile === null) return null;

    if (isMobile) {
        return (
            <MobileAppShell>
                <SearchContent isMobile />
            </MobileAppShell>
        );
    }

    return (
        <WebAppShell>
            <SearchContent />
        </WebAppShell>
    );
}
