"use client"

import React, { useEffect, useState } from 'react';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { getTimetable, getAnnouncements } from '@/lib/services/app.service';
import { TimetableEntry, Announcement } from '@/types';
import { cn } from '@/lib/utils';

export default function MobileHomePage() {
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [t, a] = await Promise.all([getTimetable(), getAnnouncements()]);
            setTimetable(t);
            setAnnouncements(a);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) return null;

    return (
        <MobileAppShell>
            <div className="px-6 py-4 space-y-10">
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900">Today&apos;s Schedule</h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-blue-600 bg-blue-50 rounded-xl"><Icons.Plus size={20} /></button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {timetable.map((t) => (
                            <div key={t.id} className="p-5 rounded-[28px] border border-gray-100 flex items-center justify-between group active:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Icons.Time size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">{t.subjectCode}</span>
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{t.subjectTitle}</h4>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.startTime} • {t.location} • {t.teacher}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-300"><Icons.Settings size={18} /></button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4 pb-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900">Announcements</h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-blue-600 bg-blue-50 rounded-xl"><Icons.Plus size={20} /></button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {announcements.map((ann) => (
                            <div
                                key={ann.id}
                                className={cn(
                                    "p-6 rounded-[32px] border space-y-3",
                                    ann.type === 'warning' ? "bg-orange-50/50 border-orange-100" :
                                        ann.type === 'success' ? "bg-green-50/50 border-green-100" :
                                            "bg-blue-50/50 border-blue-100"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{ann.title}</h4>
                                    <button className="text-gray-300"><Icons.Settings size={14} /></button>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">{ann.content}</p>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{ann.date}</span>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white",
                                        ann.type === 'warning' ? "text-orange-600" :
                                            ann.type === 'success' ? "text-green-600" :
                                                "text-blue-600"
                                    )}>
                                        {ann.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MobileAppShell>
    );
}
