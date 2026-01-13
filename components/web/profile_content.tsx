"use client"

import React from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/shared/Button';

export default function WebProfileContent() {
    return (
        <WebAppShell>
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Javis" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-black text-gray-900">Javis</h2>
                        <p className="text-gray-500 font-medium">B.Tech Student • Year 3</p>
                    </div>
                    <Button variant="outline" className="rounded-2xl">Edit Profile</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-lg">My Achievement</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Study Master', icon: '🏆', desc: '100+ hours studied' },
                                { label: 'Quick Learner', icon: '⚡', desc: 'Completed 5 units in a week' }
                            ].map(a => (
                                <div key={a.label} className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl">
                                    <span className="text-2xl">{a.icon}</span>
                                    <div>
                                        <p className="font-bold text-sm">{a.label}</p>
                                        <p className="text-xs text-gray-400">{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-lg">Study Goals</h3>
                        <div className="p-6 bg-blue-600 rounded-3xl text-white">
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Weekly Goal</p>
                            <p className="text-2xl font-black mb-4">25 Hours</p>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-white rounded-full" />
                            </div>
                            <p className="text-xs mt-3 opacity-60">18.5 hours completed so far</p>
                        </div>
                    </div>
                </div>
            </div>
        </WebAppShell>
    );
}
