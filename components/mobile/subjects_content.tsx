"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MobileAppShell } from '@/components/mobile/MobileAppShell';
import { Icons } from '@/components/shared/Icons';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { getSubjects } from '@/lib/services/app.service';
import { Subject } from '@/types';

export default function MobileSubjectsContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        getSubjects().then(setSubjects);
    }, []);

    return (
        <MobileAppShell>
            <div className="px-6 py-4 space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">My Subjects</h2>
                    <p className="text-sm text-gray-400">Track and manage your progress</p>
                </div>

                <div className="space-y-4">
                    {subjects.map((s) => {
                        const IconComponent = (Icons as any)[s.icon];
                        return (
                            <Link
                                key={s.id}
                                href={`/subject/${s.id}`}
                                className="block p-5 rounded-[32px] border active:scale-[0.98] transition-all duration-300"
                                style={{
                                    backgroundColor: `${s.color}08`,
                                    borderColor: `${s.color}20`
                                }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                                        style={{ backgroundColor: s.color }}
                                    >
                                        {IconComponent ? (
                                            <IconComponent size={24} />
                                        ) : (
                                            <span className="text-xl">{s.icon}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 leading-tight truncate">{s.title}</h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.unitCount} Units</p>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // In a real app, this would open a Bottom Sheet
                                                console.log(`Settings for subject ${s.id}`);
                                            }}
                                            className="p-3 bg-gray-50 rounded-xl text-gray-300 active:text-blue-600 active:bg-blue-50 transition-all"
                                        >
                                            <Icons.MoreVertical size={20} />
                                        </button>
                                    </div>
                                </div>
                                <ProgressBar value={s.progress} color={s.color} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </MobileAppShell>
    );
}
