"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/shared/Button';
import { Switch } from '@/components/shared/Switch';
import { cn } from '@/lib/utils';
import { useSemester } from '@/components/providers/SemesterProvider';
import { FaceVerificationModal } from './attendance/FaceVerificationModal';
import { FaceRecognitionService } from '@/lib/services/face-recognition-service';
import { toast } from 'sonner';

type Tab = 'Overview' | 'Settings';
type SettingCategory = 'General' | 'Appearance' | 'Notifications' | 'Privacy & Security' | 'Data & Storage';

export default function WebProfileContent() {
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const { enrolledSemester } = useSemester();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Settings State
    const [activeSettingsCategory, setActiveSettingsCategory] = useState<SettingCategory>('General');
    const [settings, setSettings] = useState({
        theme: 'System',
        highContrast: false,
        notifyAssignments: true,
        notifySchedule: true,
        notifyUpdates: true,
        publicProfile: true,
        shareStreaks: true,
    });

    // Face ID State
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    const handleEnrollment = async (blob: Blob) => {
        setIsEnrolling(true);
        try {
            const success = await FaceRecognitionService.enrollFace(blob);
            if (success) {
                // Removed alert for smoother flow
                setIsEnrollmentModalOpen(false);
            }
        } finally {
            setIsEnrolling(false);
        }
    };

    // Load settings from local storage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                setSettings({ ...settings, ...JSON.parse(savedSettings) });
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
    }, []);

    // Save settings on change
    useEffect(() => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }, [settings]);

    const handleGlobalLogout = async () => {
        // We'll keep the logout confirmation as it's a very significant action
        if (confirm("Are you sure you want to log out from all devices? This will require you to sign in again.")) {
            const { AuthService } = await import('@/lib/services/auth.service');
            await AuthService.signOut();
            window.location.href = '/';
        }
    };

    const handleClearCache = () => {
        // Procedding without confirm as requested by the user's general distaste for popups
        localStorage.clear();
        window.location.reload();
    };

    const handleExportData = () => {
        const data = {
            userProfile: { email: userEmail, name: editName },
            settings: settings,
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `curriculab-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await import('@/utils/supabase/client').then(mod => mod.supabase.auth.getUser());
            if (user?.email) {
                setUserEmail(user.email);
                setEditEmail(user.email);

                // Get name from metadata
                const metaName = user.user_metadata?.full_name;
                if (metaName) {
                    setEditName(metaName);
                } else {
                    const derived = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
                    setEditName(derived);
                }
            }
        };
        fetchUser();
    }, []);

    // We use the editable name for display if available, else fallback logic
    const displayName = editName || (userEmail ? (userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)) : 'Javis');

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const updates: any = {};
            if (editEmail !== userEmail) updates.email = editEmail;

            // Assume we want to save display name to metadata
            if (editName !== displayName) {
                updates.data = { full_name: editName };
            }

            const { AuthService } = await import('@/lib/services/auth.service');
            const { error } = await AuthService.updateProfile(updates);

            if (error) throw error;

            // alert("Profile updated successfully! " + (updates.email ? "Check your new email for a confirmation link." : ""));
            // Silently update or use a toast if we had one.

            // Refresh user data if needed, or just rely on local state update for now
            if (updates.email) setUserEmail(editEmail);

        } catch (err: any) {
            alert("Failed to update profile: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };
    const renderSettingsContent = () => {
        switch (activeSettingsCategory) {
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

                        {/* Face ID Section */}
                        <div className="p-5 bg-white border border-gray-100 rounded-3xl flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                                    Face ID
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                        BETA
                                    </span>
                                </p>
                                <p className="text-[11px] font-bold text-gray-400">Use facial recognition for attendance</p>
                            </div>
                            <Button
                                onClick={() => setIsEnrollmentModalOpen(true)}
                                variant="outline"
                                className="h-10 px-4 rounded-xl border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-bold text-xs"
                            >
                                Set up
                            </Button>
                        </div>

                        <button
                            onClick={handleGlobalLogout}
                            className="w-full p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 hover:bg-red-100 transition-colors"
                        >
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
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Last synced: Just now</p>
                        </div>
                        <button
                            onClick={handleClearCache}
                            className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl group hover:border-blue-200 transition-all hover:shadow-sm"
                        >
                            <span className="text-sm font-black text-gray-900">Clear Local Cache</span>
                            <Icons.ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                        </button>
                        <button
                            onClick={handleExportData}
                            className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl group hover:border-blue-200 transition-all hover:shadow-sm"
                        >
                            <span className="text-sm font-black text-gray-900">Export All Data</span>
                            <Icons.Download size={16} className="text-gray-300 group-hover:text-blue-500" />
                        </button>
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
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Update display name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="text"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Update email address"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 flex justify-end">
                                    <Button className="rounded-xl px-8 h-12" onClick={handleSaveProfile} disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
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

        { id: 'Notifications' as const, icon: Icons.Bell, desc: 'Alerts and updates' },
        { id: 'Privacy & Security' as const, icon: Icons.Lock, desc: 'Visibility and safety' },
        { id: 'Data & Storage' as const, icon: Icons.Bookmark, desc: 'Sync and backup' },
    ];

    return (
        <WebAppShell>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

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
                                <p className="text-gray-500 font-medium text-lg">
                                    {enrolledSemester
                                        ? `${enrolledSemester.programName ?? 'Student'} • ${enrolledSemester.shortName}`
                                        : 'Not enrolled in any semester'
                                    }
                                </p>
                            </div>
                            <Button
                                onClick={() => setActiveTab('Settings')}
                                variant="outline"
                                className="rounded-2xl px-6 h-12 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition-all"
                            >
                                Edit Profile
                            </Button>
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
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">{activeSettingsCategory}</h1>
                                    <p className="text-gray-400 font-bold text-sm mt-1">{categories.find(c => c.id === activeSettingsCategory)?.desc}</p>
                                </div>
                            </div>
                            {renderSettingsContent()}
                        </div>
                    </div>
                )}
            </div>


            <FaceVerificationModal
                isOpen={isEnrollmentModalOpen}
                onClose={() => setIsEnrollmentModalOpen(false)}
                onCapture={handleEnrollment}
                title="Set up Face ID"
                description="Position your face clearly in the frame to enroll."
                isProcessing={isEnrolling}
            />
        </WebAppShell >
    );
}
