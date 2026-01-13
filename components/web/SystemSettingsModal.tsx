"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { Switch } from '@/components/shared/Switch';
import { cn } from '@/lib/utils';

interface SystemSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SettingCategory = 'General' | 'Appearance' | 'Notifications' | 'Privacy & Security' | 'Data & Storage';

export function SystemSettingsModal({ isOpen, onClose }: SystemSettingsModalProps) {
    const [activeTab, setActiveTab] = useState<SettingCategory>('General');
    const [settings, setSettings] = useState({
        theme: 'System',
        highContrast: false,
        notifyAssignments: true,
        notifySchedule: true,
        notifyUpdates: false,
        publicProfile: false,
        shareStreaks: true,
    });

    const categories = [
        { id: 'Appearance' as const, icon: Icons.Trend, desc: 'Customize themes and layout colors.' },
        { id: 'Notifications' as const, icon: Icons.Analytics, desc: 'Manage assignment and class alerts.' },
        { id: 'Privacy & Security' as const, icon: Icons.Profile, desc: 'Control your visibility and credentials.' },
        { id: 'Data & Storage' as const, icon: Icons.Bookmark, desc: 'Sync settings across your devices.' },
    ];

    const renderCategoryContent = () => {
        switch (activeTab) {
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
            default:
                return (
                    <div className="space-y-3 mt-6 animate-in fade-in slide-in-from-left-4">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(cat.id)}
                                className="w-full p-4 bg-white border border-gray-100 rounded-3xl flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all group text-left"
                            >
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                    <cat.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-gray-900">{cat.id}</p>
                                    <p className="text-[11px] font-bold text-gray-400">{cat.desc}</p>
                                </div>
                                <Icons.ChevronRight size={16} className="text-gray-300 group-hover:text-blue-400" />
                            </button>
                        ))}
                    </div>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-4">
                        {activeTab !== 'General' && (
                            <button
                                onClick={() => setActiveTab('General')}
                                className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors active:scale-90"
                            >
                                <Icons.ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 border border-gray-100 shadow-sm">
                            <Icons.Settings size={24} />
                        </div>
                        <div>
                            <DialogTitle>{activeTab === 'General' ? 'System Settings' : activeTab}</DialogTitle>
                            <DialogDescription>
                                {activeTab === 'General'
                                    ? 'Manage account preferences and configuration.'
                                    : `Configure your ${activeTab.toLowerCase()} options.`}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="min-h-[360px]">
                    {renderCategoryContent()}
                </div>

                <DialogFooter className="pt-6">
                    <Button onClick={onClose} variant="ghost" className="rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">
                        Cancel
                    </Button>
                    <Button onClick={onClose} className="rounded-2xl h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
