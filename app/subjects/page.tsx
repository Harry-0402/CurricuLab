"use client"

import { useEffect, useState } from 'react';
import WebSubjectsContent from '@/components/web/subjects_content';
import MobileSubjectsContent from '@/components/mobile/subjects_content';

export default function SubjectsPage() {
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

    return isMobile ? <MobileSubjectsContent /> : <WebSubjectsContent />;
}
