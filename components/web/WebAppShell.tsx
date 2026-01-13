import React from 'react';
import { WebSidebar } from './WebSidebar';
import { WebHeader } from './WebHeader';
import { WebRightPanel } from './WebRightPanel';

export function WebAppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-[#fafbfc] overflow-hidden">
            <WebSidebar />
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <WebHeader />
                <div className="flex-1 flex overflow-hidden min-h-0">
                    <main className="flex-1 p-8 overflow-y-auto no-scrollbar scroll-smooth min-w-0">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                    <WebRightPanel />
                </div>
            </div>
        </div>
    );
}
