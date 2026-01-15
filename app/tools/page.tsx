import { WebAppShell } from '@/components/web/WebAppShell';

export default function ToolsRootPage() {
    return (
        <WebAppShell>
            <div className="space-y-12">
                <div>
                    <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Tools</h1>
                    <p className="text-5xl font-black text-gray-900 tracking-tight">Utility Center</p>
                </div>
                <div className="p-10 bg-gray-50 rounded-[40px] border border-dashed border-gray-200 text-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select a tool from the sidebar to begin</p>
                </div>
            </div>
        </WebAppShell>
    );
}
