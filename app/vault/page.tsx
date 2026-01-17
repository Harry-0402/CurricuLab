import React from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { VaultContent } from '@/components/web/VaultContent';

export default function VaultPage() {
    return (
        <WebAppShell>
            <VaultContent />
        </WebAppShell>
    );
}
