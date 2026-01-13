"use client"

import { useEffect, useState } from 'react';
import WebSubjectDetailContent from '@/components/web/subject_detail_content';
import MobileSubjectDetailContent from '@/components/mobile/subject_detail_content';

export default function SubjectDetailPage() {
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

    return isMobile ? <MobileSubjectDetailContent /> : <WebSubjectDetailContent />;
}
