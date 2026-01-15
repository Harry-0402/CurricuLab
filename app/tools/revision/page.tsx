"use client"

import { useEffect, useState } from 'react';
import { RevisionGeneratorContent } from '@/components/web/RevisionGeneratorContent';
import { RevisionGeneratorMobile } from '@/components/mobile/RevisionGeneratorMobile';

export default function RevisionPage() {
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

    return isMobile ? <RevisionGeneratorMobile /> : <RevisionGeneratorContent />;
}
