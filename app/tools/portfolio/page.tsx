"use client"

import { WebAppShell } from '@/components/web/WebAppShell';
import { PortfolioBuilder } from '../../../components/web/PortfolioBuilder';

export default function PortfolioBuilderPage() {
    return (
        <WebAppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">Portfolio Builder</p>
                </div>
                <PortfolioBuilder />
            </div>
        </WebAppShell>
    );
}
