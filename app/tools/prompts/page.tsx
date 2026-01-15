"use client"

import { useEffect, useState } from 'react';
import { PromptLabContent } from '@/components/web/PromptLabContent';
import { PromptLabMobile } from '@/components/mobile/PromptLabMobile';

export default function PromptsPage() {
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

    return isMobile ? <PromptLabMobile /> : <PromptLabContent />;
}
