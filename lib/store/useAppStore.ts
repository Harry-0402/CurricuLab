import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Bookmark, StudySession, TimetableEntry, Announcement } from '@/types';

const TIMETABLE_PRESET: TimetableEntry[] = [];

interface AppState {
    bookmarks: Bookmark[];
    weeklyGoalHours: number;
    studySessions: StudySession[];
    recentlyOpened: string[]; // IDs
    unitProgress: Record<string, boolean>; // unitId -> isCompleted
    timetable: TimetableEntry[];
    announcements: Announcement[];
    isRightPanelMinimized: boolean;
    activeSemesterId: string | null; // which semester is currently being viewed
    isAnalyticaOpen: boolean;
    analyticaInput: string;

    // Actions
    addBookmark: (itemId: string, type: Bookmark['type']) => void;
    removeBookmark: (itemId: string) => void;
    setWeeklyGoal: (hours: number) => void;
    addStudySession: (session: StudySession) => void;
    markUnitComplete: (unitId: string, completed: boolean) => void;
    addToRecent: (id: string) => void;
    setActiveSemester: (semesterId: string | null) => void;

    // Timetable hydrate/replace
    setTimetable: (entries: TimetableEntry[]) => void;

    // Timetable Actions
    addTimetableEntry: (entry: TimetableEntry) => void;
    updateTimetableEntry: (entry: TimetableEntry) => void;
    deleteTimetableEntry: (id: string) => void;

    // Announcement Actions
    addAnnouncement: (announcement: Announcement) => void;
    updateAnnouncement: (announcement: Announcement) => void;
    deleteAnnouncement: (id: string) => void;
    setAnnouncements: (announcements: Announcement[]) => void;
    toggleRightPanel: () => void;
    setAnalyticaOpen: (isOpen: boolean) => void;
    setAnalyticaInput: (text: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            bookmarks: [],
            weeklyGoalHours: 20,
            studySessions: [],
            recentlyOpened: [],
            unitProgress: {},
            timetable: TIMETABLE_PRESET,
            announcements: [],
            isRightPanelMinimized: true,
            activeSemesterId: null,
            isAnalyticaOpen: false,
            analyticaInput: '',

            addBookmark: (itemId, type) => set((state) => ({
                bookmarks: [...state.bookmarks, { id: Math.random().toString(36).substr(2, 9), itemId, type, addedAt: new Date().toISOString() }]
            })),

            removeBookmark: (itemId) => set((state) => ({
                bookmarks: state.bookmarks.filter((b) => b.itemId !== itemId)
            })),

            setWeeklyGoal: (hours) => set({ weeklyGoalHours: hours }),

            addStudySession: (session) => set((state) => ({
                studySessions: [...state.studySessions, session]
            })),

            markUnitComplete: (unitId, completed) => set((state) => ({
                unitProgress: { ...state.unitProgress, [unitId]: completed }
            })),

            addToRecent: (id) => set((state) => ({
                recentlyOpened: [id, ...state.recentlyOpened.filter((item) => item !== id)].slice(0, 10)
            })),

            setActiveSemester: (semesterId) => set({ activeSemesterId: semesterId }),

            setTimetable: (entries) => set({ timetable: entries }),

            addTimetableEntry: (entry) => set((state) => ({
                timetable: [...state.timetable, entry]
            })),

            updateTimetableEntry: (entry) => set((state) => ({
                timetable: state.timetable.map((e) => e.id === entry.id ? entry : e)
            })),

            deleteTimetableEntry: (id) => set((state) => ({
                timetable: state.timetable.filter((e) => e.id !== id)
            })),

            addAnnouncement: (announcement) => set((state) => ({
                announcements: [...state.announcements, announcement]
            })),

            updateAnnouncement: (announcement) => set((state) => ({
                announcements: state.announcements.map((a) => a.id === announcement.id ? announcement : a)
            })),

            deleteAnnouncement: (id) => set((state) => ({
                announcements: state.announcements.filter((a) => a.id !== id)
            })),

            setAnnouncements: (announcements) => set({ announcements }),

            toggleRightPanel: () => set((state) => ({
                isRightPanelMinimized: !state.isRightPanelMinimized
            })),
            
            setAnalyticaOpen: (isOpen) => set({ isAnalyticaOpen: isOpen }),
            setAnalyticaInput: (text) => set({ analyticaInput: text }),
        }),
        {
            name: 'curriculab-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
