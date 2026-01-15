"use client"

import { useEffect, useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { ChangelogService, ChangeLog } from '@/lib/services/changelog.service';
import { Icons } from '@/components/shared/Icons';
import { formatDistanceToNow } from 'date-fns';

export default function ChangelogPage() {
    const [logs, setLogs] = useState<ChangeLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    async function loadLogs() {
        setLoading(true);
        const data = await ChangelogService.getRecentChanges(50);
        setLogs(data);
        setLoading(false);
    }

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE': return <Icons.Plus className="text-green-600" size={16} />;
            case 'UPDATE': return <Icons.Edit className="text-blue-600" size={16} />;
            case 'DELETE': return <Icons.Delete className="text-red-600" size={16} />;
            default: return <Icons.Info className="text-gray-600" size={16} />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-green-50 border-green-200 text-green-700';
            case 'UPDATE': return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'DELETE': return 'bg-red-50 border-red-200 text-red-700';
            default: return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    return (
        <WebAppShell>
            <div className="max-w-5xl mx-auto pb-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                                <Icons.Clock size={24} />
                            </span>
                            Change History
                        </h1>
                        <p className="text-gray-500 font-bold mt-2 ml-16">
                            Track recent modifications to the system.
                        </p>
                    </div>
                    <button
                        onClick={loadLogs}
                        className="p-3 bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm active:scale-95"
                        title="Refresh Logs"
                    >
                        <Icons.Subjects size={20} />
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-[30px] shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                            <p className="font-bold text-sm">Loading history...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Icons.CheckSquare size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No changes recorded</h3>
                            <p className="text-gray-500 mt-1">Start editing content to see logs here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {logs.map((log) => (
                                <div key={log.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-start gap-4">
                                    <div className="mt-1">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getActionColor(log.action)}`}>
                                            {getActionIcon(log.action)}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-gray-900">
                                                {log.action} <span className="text-gray-400 font-medium">on</span> {log.entityType}
                                            </h4>
                                            <span className="text-xs font-bold text-gray-400">
                                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-sm text-gray-600 font-medium font-mono mb-2">
                                            {JSON.stringify(log.changes, null, 2)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <Icons.Profile size={14} />
                                            Changed by: <span className="text-gray-700">{log.changedBy}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </WebAppShell>
    );
}
