"use client"

import React from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/shared/Button';

export default function WebProfileContent() {
    const [userEmail, setUserEmail] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await import('@/utils/supabase/client').then(mod => mod.supabase.auth.getUser());
            if (user?.email) {
                setUserEmail(user.email);
            }
        };
        fetchUser();
    }, []);

    const displayName = userEmail ? userEmail.split('@')[0] : 'Javis';

    return (
        <WebAppShell>
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Card */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-28 h-28 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden shadow-inner border-2 border-white">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}&backgroundColor=b6e3f4`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight capitalize">{displayName}</h2>
                        <p className="text-gray-500 font-medium text-lg">B.Tech Student • Year 3</p>
                    </div>
                    <Button variant="outline" className="rounded-2xl px-6 h-12 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition-all">
                        Edit Profile
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Achievements Card */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="font-bold text-xl text-gray-900">My Achievement</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Study Master', icon: Icons.Trophy, color: 'text-amber-500', bg: 'bg-amber-50', desc: '100+ hours studied' },
                                { label: 'Quick Learner', icon: Icons.Zap, color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Completed 5 units in a week' }
                            ].map((a, i) => (
                                <div key={i} className="flex gap-5 items-center p-5 bg-white border border-gray-50 shadow-sm rounded-2xl hover:shadow-md transition-all cursor-default">
                                    <div className={`w-12 h-12 rounded-xl ${a.bg} ${a.color} flex items-center justify-center shrink-0`}>
                                        <a.icon size={24} fill="currentColor" className="opacity-90" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-base mb-0.5">{a.label}</p>
                                        <p className="text-gray-400 text-sm font-medium">{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Study Goals Card */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-900">Study Goals</h3>
                        <div className="p-8 bg-blue-600 rounded-3xl text-white flex-1 flex flex-col justify-center shadow-lg shadow-blue-200">
                            <div className="mb-6">
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2">Weekly Goal</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black">25</p>
                                    <p className="text-xl font-medium text-blue-100">Hours</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="w-full h-3 bg-blue-800/30 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div className="w-[74%] h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>
                                <p className="text-xs font-medium text-blue-100 opacity-80 pl-1">18.5 hours completed so far</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WebAppShell>
    );
}
