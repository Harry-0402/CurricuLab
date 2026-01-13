"use client"

import { useEffect, useState } from 'react';
import WebProfileContent from '@/components/web/profile_content';
import MobileProfileContent from '@/components/mobile/profile_content';

export default function ProfilePage() {
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

    return isMobile ? <MobileProfileContent /> : <WebProfileContent />;
}
