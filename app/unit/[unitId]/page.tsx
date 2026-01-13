"use client"

import { useEffect, useState } from 'react';
import WebUnitDetailContent from '@/components/web/unit_detail_content';
import MobileUnitDetailContent from '@/components/mobile/unit_detail_content';

export default function UnitDetailPage() {
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

    return isMobile ? <MobileUnitDetailContent /> : <WebUnitDetailContent />;
}
