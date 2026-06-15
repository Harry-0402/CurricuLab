import React from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { YoutubeLibraryContent } from '@/components/web/YoutubeLibraryContent';

export const metadata = {
    title: 'YouTube Library – CurricuLab',
    description: 'Browse curated YouTube video resources organised by subject and unit.',
};

export default function YoutubeLibraryPage() {
    return (
        <WebAppShell>
            <YoutubeLibraryContent />
        </WebAppShell>
    );
}
