"use client"

import React from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';

export default function MobileProfileContent() {
    return (
        <MobileAppShell>
            <div className="px-6 py-4 space-y-8">
                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="w-24 h-24 rounded-[32px] bg-blue-50 overflow-hidden shadow-xl shadow-blue-100">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Javis" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black text-gray-900">Javis</h2>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">B.Tech Student</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Achievements', icon: Icons.Trend, color: 'text-orange-500 bg-orange-50' },
                        { label: 'Study Settings', icon: Icons.Time, color: 'text-blue-500 bg-blue-50' },
                        { label: 'Notifications', icon: Icons.Subjects, color: 'text-purple-500 bg-purple-50' },
                        { label: 'Account Security', icon: Icons.CheckSquare, color: 'text-green-500 bg-green-50' },
                    ].map((item) => (
                        <button key={item.label} className="w-full flex items-center justify-between p-5 rounded-[28px] bg-white border border-gray-100 active:bg-gray-50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                    <item.icon size={20} />
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{item.label}</span>
                            </div>
                            <Icons.ChevronRight size={18} className="text-gray-300" />
                        </button>
                    ))}
                </div>

                <button className="w-full py-5 rounded-[28px] bg-red-50 text-red-600 font-bold text-sm">Sign Out</button>
            </div>
        </MobileAppShell>
    );
}
