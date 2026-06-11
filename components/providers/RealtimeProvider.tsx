"use client";

import React, { useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useAppStore } from '@/lib/store/useAppStore';
import { getTimetable } from '@/lib/services/timetable-service';
import { getAnnouncements } from '@/lib/services/announcement-service';
import { SubjectService } from '@/lib/data/subject-service';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const activeSemesterId = useAppStore(state => state.activeSemesterId);
    const setTimetable = useAppStore(state => state.setTimetable);
    const setAnnouncements = useAppStore(state => state.setAnnouncements);

    useEffect(() => {
        const channel = supabase.channel('public-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'timetable' }, async () => {
                if (activeSemesterId) {
                    const entries = await getTimetable(activeSemesterId);
                    setTimetable(entries || []);
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, async () => {
                const data = await getAnnouncements();
                setAnnouncements(data || []);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'subjects' }, () => {
                SubjectService.invalidateCache();
                window.dispatchEvent(new Event('subjects_updated'));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'semesters' }, () => {
                window.dispatchEvent(new Event('semesters_updated'));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeSemesterId, setTimetable, setAnnouncements]);

    return <>{children}</>;
}
