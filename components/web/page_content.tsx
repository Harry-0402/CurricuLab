"use client"

import React, { useEffect, useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { KPIStatCard } from '@/components/web/KPIStatCard';
import { TimetableWidget } from '@/components/web/TimetableWidget';
import { Icons } from '@/components/shared/Icons';
import { useAppStore } from '@/lib/store/useAppStore';
import { AnnouncementWidget } from './AnnouncementWidget';
import { cn } from '@/lib/utils';
import { getAnnouncements } from '@/lib/services/announcement-service';

export default function WebHomePage() {
    const { timetable, announcements, setAnnouncements } = useAppStore();

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

    return (
        <WebAppShell>
            <div className="max-w-5xl mx-auto space-y-10">
                <TimetableWidget entries={timetable} />
                <AnnouncementWidget announcements={announcements} />
            </div>
        </WebAppShell>
    );
}
