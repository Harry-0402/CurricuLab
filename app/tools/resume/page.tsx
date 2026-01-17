"use client";

import React from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { ResumeBuilderContent } from '@/components/web/ResumeBuilderContent';

export default function ResumeToolPage() {
    return (
        <WebAppShell>
            <ResumeBuilderContent />
        </WebAppShell>
    );
}
