"use client"

import { useEffect, useState } from 'react';
import { DigitalLibraryContent } from '@/components/web/DigitalLibraryContent';
import { DigitalLibraryMobile } from '@/components/mobile/DigitalLibraryMobile';

export default function ResourcesPage() {
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

    return isMobile ? <DigitalLibraryMobile /> : <DigitalLibraryContent />;
}
