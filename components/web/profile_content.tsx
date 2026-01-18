"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/shared/Button';
import { Switch } from '@/components/shared/Switch';
import { cn } from '@/lib/utils';
import { ChangelogService, ChangeLog } from '@/lib/services/changelog.service';
import { formatDistanceToNow } from 'date-fns';
import { AttendanceWidget } from './AttendanceWidget';

type Tab = 'Overview' | 'Settings';
type SettingCategory = 'General' | 'Appearance' | 'Notifications' | 'Privacy & Security' | 'Data & Storage' | 'Change History';

export default function WebProfileContent() {
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Settings State
    const [activeSettingsCategory, setActiveSettingsCategory] = useState<SettingCategory>('General');
    const [settings, setSettings] = useState({
        theme: 'System',
        highContrast: false,
        notifyAssignments: true,
        notifySchedule: true,
        notifyUpdates: false,
        publicProfile: false,
        shareStreaks: true,
    });

    // Changelog State
    const [logs, setLogs] = useState<ChangeLog[]>([]);
    const [logsLoading, setLogsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await import('@/utils/supabase/client').then(mod => mod.supabase.auth.getUser());
            if (user?.email) {
                setUserEmail(user.email);
            }
        };
        fetchUser();
    }, []);

    // Fetch logs when Change History is accessed
    useEffect(() => {
        if (activeTab === 'Settings' && activeSettingsCategory === 'Change History') {
            loadLogs();
        }
    }, [activeTab, activeSettingsCategory]);

    const loadLogs = async () => {
        setLogsLoading(true);
        const data = await ChangelogService.getRecentChanges(50);
        setLogs(data);
        setLogsLoading(false);
    };

    const displayName = userEmail ? (userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)) : 'Javis';

    // --- Render Helpers ---

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

    const renderSettingsContent = () => {
        switch (activeSettingsCategory) {
            case 'Appearance':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Color Theme</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Light', 'Dark', 'System'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setSettings({ ...settings, theme: t })}
                                        className={cn(
                                            "py-6 rounded-2xl border font-bold text-sm transition-all",
                                            settings.theme === t
                                                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                                                : "bg-gray-50 text-gray-500 border-gray-100 hover:border-blue-100"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                                <p className="text-sm font-black text-gray-900">High Contrast</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Enhance visibility</p>
                            </div>
                            <Switch
                                checked={settings.highContrast}
                                onChange={(val) => setSettings({ ...settings, highContrast: val })}
                            />
                        </div>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        {[
                            { id: 'notifyAssignments', label: 'Assignments', desc: 'Deadlines and task updates' },
                            { id: 'notifySchedule', label: 'Schedule Changes', desc: 'Timetable and room adjustments' },
                            { id: 'notifyUpdates', label: 'System Updates', desc: 'New features and improvements' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl">
                                <div>
                                    <p className="text-sm font-black text-gray-900">{item.label}</p>
                                    <p className="text-[11px] font-bold text-gray-400">{item.desc}</p>
                                </div>
                                <Switch
                                    checked={(settings as any)[item.id]}
                                    onChange={(val) => setSettings({ ...settings, [item.id]: val })}
                                />
                            </div>
                        ))}
                    </div>
                );
            case 'Privacy & Security':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        {[
                            { id: 'publicProfile', label: 'Public Profile', desc: 'Allow others to find your profile' },
                            { id: 'shareStreaks', label: 'Share Streaks', desc: 'Show study accomplishments in hub' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl">
                                <div>
                                    <p className="text-sm font-black text-gray-900">{item.label}</p>
                                    <p className="text-[11px] font-bold text-gray-400">{item.desc}</p>
                                </div>
                                <Switch
                                    checked={(settings as any)[item.id]}
                                    onChange={(val) => setSettings({ ...settings, [item.id]: val })}
                                />
                            </div>
                        ))}
                        <button className="w-full p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4">
                            Log out from all devices
                        </button>
                    </div>
                );
            case 'Data & Storage':
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 border-dashed text-center">
                            <Icons.Bookmark className="mx-auto text-blue-500 mb-2" size={24} />
                            <p className="text-sm font-black text-gray-900">Cloud Sync Active</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Last synced: 2 mins ago</p>
                        </div>
                        <button className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl group hover:border-blue-200 transition-all">
                            <span className="text-sm font-black text-gray-900">Clear Local Cache</span>
                            <Icons.ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                        </button>
                        <button className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl group hover:border-blue-200 transition-all">
                            <span className="text-sm font-black text-gray-900">Export All Data</span>
                            <Icons.Download size={16} className="text-gray-300 group-hover:text-blue-500" />
                        </button>
                    </div>
                );
            case 'Change History':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-lg text-gray-900">System Changelog</h3>
                                <p className="text-xs font-bold text-gray-400">Recent system modifications</p>
                            </div>
                            <button
                                onClick={loadLogs}
                                className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 rounded-lg transition-all shadow-sm active:scale-95"
                                title="Refresh Logs"
                            >
                                <Icons.Subjects size={16} />
                            </button>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-[400px]">
                            {logsLoading ? (
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
                                        <div key={log.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-start gap-3">
                                            <div className="mt-1">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getActionColor(log.action)}`}>
                                                    {getActionIcon(log.action)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-gray-900 text-sm truncate pr-2">
                                                        {log.action} <span className="text-gray-400 font-medium">on</span> {log.entityType}
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-gray-400 shrink-0 whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 text-[10px] text-gray-600 font-medium font-mono mb-2 overflow-x-auto">
                                                    {JSON.stringify(log.changes)}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                                    <Icons.Profile size={12} />
                                                    Changed by: <span className="text-gray-700">{log.changedBy}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            default: // General or Login settings
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl space-y-4">
                            <h3 className="font-bold text-gray-900">Profile Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
                                    <input
                                        type="text"
                                        defaultValue={displayName}
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Update display name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="text"
                                        defaultValue={userEmail || ''}
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Update email address"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 flex justify-end">
                                    <Button className="rounded-xl px-8 h-12" onClick={() => alert("Profile update feature coming soon!")}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                );
        }
    };

    const categories = [
        { id: 'General' as const, icon: Icons.Settings, desc: 'Profile and account details' },
        { id: 'Appearance' as const, icon: Icons.Trend, desc: 'Themes and colors' },
        { id: 'Notifications' as const, icon: Icons.Analytics, desc: 'Alerts and updates' },
        { id: 'Privacy & Security' as const, icon: Icons.Lock, desc: 'Visibility and safety' },
        { id: 'Data & Storage' as const, icon: Icons.Bookmark, desc: 'Sync and backup' },
        { id: 'Change History' as const, icon: Icons.Clock, desc: 'System logs' },
    ];

    return (
        <WebAppShell>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

                {/* Top Navigation / Header */}
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 w-fit">
                    {(['Overview', 'Settings'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                activeTab === tab
                                    ? "bg-black text-white shadow-md"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'Overview' ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
                        {/* Header Card */}
                        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="w-28 h-28 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden shadow-inner border-2 border-white">
                                <img
                                    src="/assets/profile-avatar.png"
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h2 className="text-4xl font-black text-gray-900 tracking-tight capitalize">{displayName}</h2>
                                <p className="text-gray-500 font-medium text-lg">MBA Student • Year 1</p>
                            </div>
                            <Button
                                onClick={() => setActiveTab('Settings')}
                                variant="outline"
                                className="rounded-2xl px-6 h-12 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition-all"
                            >
                                Edit Profile
                            </Button>
                        </div>


                        <div className="mt-8">
                            <AttendanceWidget />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-right-2">
                        {/* Settings Sidebar */}
                        <div className="col-span-1 space-y-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveSettingsCategory(cat.id)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl flex items-center gap-3 text-left transition-all",
                                        activeSettingsCategory === cat.id
                                            ? "bg-white shadow-sm border border-gray-100 text-blue-600 ring-1 ring-blue-50"
                                            : "text-gray-500 hover:bg-white hover:text-gray-900"
                                    )}
                                >
                                    <cat.icon size={18} className={activeSettingsCategory === cat.id ? "text-blue-600" : "text-gray-400"} />
                                    <span className={cn("text-sm font-bold", activeSettingsCategory === cat.id ? "text-gray-900" : "")}>{cat.id}</span>
                                </button>
                            ))}
                        </div>

                        {/* Settings Content */}
                        <div className="col-span-1 md:col-span-3">
                            <div className="mb-6">
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{activeSettingsCategory}</h1>
                                <p className="text-gray-400 font-bold text-sm mt-1">{categories.find(c => c.id === activeSettingsCategory)?.desc}</p>
                            </div>
                            {renderSettingsContent()}
                        </div>
                    </div>
                )}
            </div>
        </WebAppShell >
    );
}
