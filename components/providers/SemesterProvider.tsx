'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Semester } from '@/types';
import { getSemesters, getSemesterById, SEM2_ID } from '@/lib/services/semester-service';
import { getUserEnrollment } from '@/lib/services/enrollment-service';
import { useAppStore } from '@/lib/store/useAppStore';

interface SemesterContextValue {
    /** The semester currently being viewed (may differ from enrollment when browsing) */
    activeSemester: Semester | null;
    activeSemesterId: string | null;

    /** The user's enrolled semester (their "home" class) */
    enrolledSemesterId: string | null;
    enrolledSemester: Semester | null;

    /** All available semesters */
    allSemesters: Semester[];

    /** Switch the viewed semester (browse mode) */
    setActiveSemester: (semesterId: string) => void;

    /** After enrollment changes, refresh context */
    refreshEnrollment: () => Promise<void>;

    isLoading: boolean;

    /** True when viewing a semester other than the enrolled one */
    isBrowsing: boolean;
}

const SemesterContext = createContext<SemesterContextValue>({
    activeSemester: null,
    activeSemesterId: null,
    enrolledSemesterId: null,
    enrolledSemester: null,
    allSemesters: [],
    setActiveSemester: () => {},
    refreshEnrollment: async () => {},
    isLoading: true,
    isBrowsing: false,
});

export function SemesterProvider({ children }: { children: React.ReactNode }) {
    const activeSemesterId = useAppStore(state => state.activeSemesterId);
    const setStoreActiveSemester = useAppStore(state => state.setActiveSemester);

    const [allSemesters, setAllSemesters] = useState<Semester[]>([]);
    const [activeSemester, setActiveSemesterState] = useState<Semester | null>(null);
    const [enrolledSemesterId, setEnrolledSemesterId] = useState<string | null>(null);
    const [enrolledSemester, setEnrolledSemester] = useState<Semester | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load all semesters once
    useEffect(() => {
        const load = async () => {
            const semesters = await getSemesters();
            setAllSemesters(semesters);
        };
        load();
    }, []);

    // Resolve user's enrolled semester whenever auth changes
    const refreshEnrollment = async () => {
        try {
            const { supabase } = await import('@/utils/supabase/client');
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const enrollment = await getUserEnrollment(session.user.id);
                const sid = enrollment.semesterId ?? SEM2_ID;
                setEnrolledSemesterId(sid);

                const sem = await getSemesterById(sid);
                setEnrolledSemester(sem);

                // If store has no active semester yet, default to enrollment
                if (!activeSemesterId) {
                    setStoreActiveSemester(sid);
                }
            } else {
                // Non-logged-in: default to Sem 2
                setEnrolledSemesterId(SEM2_ID);
                const sem = await getSemesterById(SEM2_ID);
                setEnrolledSemester(sem);
                if (!activeSemesterId) {
                    setStoreActiveSemester(SEM2_ID);
                }
            }
        } catch (err) {
            console.error('SemesterProvider: error loading enrollment', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshEnrollment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Resolve active semester object whenever the store ID changes
    useEffect(() => {
        if (!activeSemesterId || allSemesters.length === 0) return;
        const found = allSemesters.find(s => s.id === activeSemesterId) ?? null;
        if (found) {
            setActiveSemesterState(found);
        } else {
            // Fetch directly if not in the list yet
            getSemesterById(activeSemesterId).then(s => setActiveSemesterState(s));
        }
    }, [activeSemesterId, allSemesters]);

    const setActiveSemester = (semesterId: string) => {
        setStoreActiveSemester(semesterId);
    };

    const effectiveActiveSemesterId = activeSemesterId ?? enrolledSemesterId ?? SEM2_ID;
    const isBrowsing = !!enrolledSemesterId && effectiveActiveSemesterId !== enrolledSemesterId;

    return (
        <SemesterContext.Provider
            value={{
                activeSemester,
                activeSemesterId: effectiveActiveSemesterId,
                enrolledSemesterId,
                enrolledSemester,
                allSemesters,
                setActiveSemester,
                refreshEnrollment,
                isLoading,
                isBrowsing,
            }}
        >
            {children}
        </SemesterContext.Provider>
    );
}

export function useSemester() {
    return useContext(SemesterContext);
}
