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

export default function WebHomePage() {
    const { timetable, announcements, setAnnouncements, setTimetable } = useAppStore();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            }
        };
        fetchAnnouncements();
    }, [setAnnouncements]);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const entries = await getTimetable();
                if (entries && entries.length) {
                    setTimetable(entries);
                }
            } catch (error) {
                console.error('Failed to fetch timetable:', error);
            }
        };
        fetchTimetable();
    }, [setTimetable]);

    return (
        <WebAppShell>
            <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TimetableWidget entries={timetable} />
                <FacultyLineup entries={timetable} />
                <AnnouncementWidget announcements={announcements} />
            </div>
        </WebAppShell>
    );
}
