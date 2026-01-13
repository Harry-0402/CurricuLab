"use client"

import { useEffect, useState } from 'react';
import WebHomePage from '@/components/web/page_content';
import MobileHomePage from '@/components/mobile/page_content';

export default function RootPage() {
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

    return isMobile ? <MobileHomePage /> : <WebHomePage />;
}
