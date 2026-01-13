"use client"

import { useEffect, useState } from 'react';
import WebNoteViewerContent from '@/components/web/note_viewer_content';
import MobileNoteViewerContent from '@/components/mobile/note_viewer_content';

export default function NoteViewerPage() {
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

    return isMobile ? <MobileNoteViewerContent /> : <WebNoteViewerContent />;
}
