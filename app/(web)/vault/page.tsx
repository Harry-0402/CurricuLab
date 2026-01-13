import React from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { VaultContent } from '@/components/web/VaultContent';

export default function VaultPage() {
    return (
        <WebAppShell>
            <div className="space-y-12">
                <div>
                    <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Archive</h1>
                    <p className="text-5xl font-black text-gray-900 tracking-tight">Knowledge Vault</p>
                </div>

                <VaultContent />
            </div>
        </WebAppShell>
    );
}
