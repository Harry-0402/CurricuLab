"use client"

import React, { useEffect, useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { KPIStatCard } from '@/components/web/KPIStatCard';
import { TimetableWidget } from '@/components/web/TimetableWidget';
import { FacultyLineup } from '@/components/web/FacultyLineup';
import { Icons } from '@/components/shared/Icons';
import { useAppStore } from '@/lib/store/useAppStore';
import { AnnouncementWidget } from './AnnouncementWidget';
import { cn } from '@/lib/utils';
import { getAnnouncements } from '@/lib/services/announcement-service';
import { getTimetable } from '@/lib/services/timetable-service';
import { useSemester } from '@/components/providers/SemesterProvider';


export default function WebHomePage() {
    const timetable = useAppStore(state => state.timetable);
    const announcements = useAppStore(state => state.announcements);
    const setAnnouncements = useAppStore(state => state.setAnnouncements);
    const setTimetable = useAppStore(state => state.setTimetable);
    const { activeSemesterId } = useSemester();
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements(activeSemesterId ?? undefined);
                setAnnouncements(data);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            }
        };
        fetchAnnouncements();
    }, [setAnnouncements, activeSemesterId]);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const entries = await getTimetable(activeSemesterId ?? undefined);
                setTimetable(entries || []);
            } catch (error) {
                console.error('Failed to fetch timetable:', error);
            }
        };
        fetchTimetable();
    }, [setTimetable, activeSemesterId]);


    return (
        <WebAppShell>
            <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* ERP Attendance Guide */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[24px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                            <Icons.Info size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">Check Your Attendance on Sandip ERP</h3>
                            <p className="text-sm font-medium text-gray-600">
                                To view your official attendance records, please visit the <strong>Sandip ERP</strong> portal. Navigate to the <strong>Main Menu &gt; View Subject</strong> section.
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://www.sandipuniversity.edu.in/erp-login.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-200"
                    >
                        <span>Open Sandip ERP</span>
                        <Icons.ExternalLink size={16} />
                    </a>
                </div>

                {mounted ? (
                    <>
                        <TimetableWidget entries={timetable} />
                        <AnnouncementWidget announcements={announcements} />
                    </>
                ) : (
                    <>
                        {/* Timetable Skeleton */}
                        <div className="h-64 bg-gray-50/50 rounded-[32px] border border-gray-100/50 animate-pulse flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Loading Academic Roadmap...</span>
                        </div>
                        {/* Announcements Skeleton */}
                        <div className="h-64 bg-gray-50/50 rounded-[32px] border border-gray-100/50 animate-pulse flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Loading Announcements...</span>
                        </div>
                    </>
                )}
            </div>
        </WebAppShell>
    );
}
