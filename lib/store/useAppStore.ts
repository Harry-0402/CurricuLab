import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Bookmark, StudySession, TimetableEntry, Announcement } from '@/types';

const TIMETABLE_PRESET: TimetableEntry[] = [
    { id: 'mon-1015-pba206', day: 'Monday', startTime: '10:15 AM', endTime: '11:00 AM', subjectTitle: 'Legal Aspects of Business', subjectCode: 'PBA206', location: 'SCMS Classroom', teacher: 'Adv. Vishal Jadhav', progress: 0 },
    { id: 'mon-1100-pba205', day: 'Monday', startTime: '11:00 AM', endTime: '12:00 PM', subjectTitle: 'Digital Transformation', subjectCode: 'PBA205', location: 'SCMS Classroom', teacher: 'Mr. Aniket Alvekar', progress: 0 },
    { id: 'mon-1200-pba204', day: 'Monday', startTime: '12:00 PM', endTime: '01:00 PM', subjectTitle: 'Production and Operations Management', subjectCode: 'PBA204', location: 'SCMS Classroom', teacher: 'Dr. Shailendra Baraniya', progress: 0 },
    { id: 'mon-1400-pba207', day: 'Monday', startTime: '02:00 PM', endTime: '03:00 PM', subjectTitle: 'Data Visualization and Story Telling', subjectCode: 'PBA207', location: 'SCMS Classroom', teacher: 'Dr. Samadhan Bundhe', progress: 0 },
    { id: 'mon-1500-pba211', day: 'Monday', startTime: '03:00 PM', endTime: '04:00 PM', subjectTitle: 'Data Analysis using Python', subjectCode: 'PBA211', location: 'SCMS Lab', teacher: 'Mr. Aniket Alvekar', progress: 0 },
    { id: 'mon-1600-pba212', day: 'Monday', startTime: '04:00 PM', endTime: '05:00 PM', subjectTitle: 'Data Analysis using Power BI (P)', subjectCode: 'PBA212', location: 'Power BI Lab', teacher: 'Dr. Samadhan Bundhe', progress: 0 },

    { id: 'tue-1015-pba206', day: 'Tuesday', startTime: '10:15 AM', endTime: '11:00 AM', subjectTitle: 'Legal Aspects of Business', subjectCode: 'PBA206', location: 'SCMS Classroom', teacher: 'Adv. Vishal Jadhav', progress: 0 },
    { id: 'tue-1100-pba205', day: 'Tuesday', startTime: '11:00 AM', endTime: '12:00 PM', subjectTitle: 'Digital Transformation', subjectCode: 'PBA205', location: 'SCMS Classroom', teacher: 'Mr. Aniket Alvekar', progress: 0 },
    { id: 'tue-1200-pba204', day: 'Tuesday', startTime: '12:00 PM', endTime: '01:00 PM', subjectTitle: 'Production and Operations Management (T)', subjectCode: 'PBA204', location: 'Tutorial Room', teacher: 'Dr. Shailendra Baraniya', progress: 0 },
    { id: 'tue-1400-pba211', day: 'Tuesday', startTime: '02:00 PM', endTime: '03:00 PM', subjectTitle: 'Data Analysis using Python (P)', subjectCode: 'PBA211', location: 'Python Lab', teacher: 'Mr. Aniket Alvekar', progress: 0 },
    { id: 'tue-1500-pba208', day: 'Tuesday', startTime: '03:00 PM', endTime: '04:00 PM', subjectTitle: 'Business Research Methods', subjectCode: 'PBA208', location: 'SCMS Classroom', teacher: 'Dr. Zahir Shaikh', progress: 0 },
    { id: 'tue-1600-pba212', day: 'Tuesday', startTime: '04:00 PM', endTime: '05:00 PM', subjectTitle: 'Data Analysis using Power BI (P)', subjectCode: 'PBA212', location: 'Power BI Lab', teacher: 'Dr. Samadhan Bundhe', progress: 0 },

    { id: 'wed-1015-pba206', day: 'Wednesday', startTime: '10:15 AM', endTime: '11:00 AM', subjectTitle: 'Legal Aspects of Business', subjectCode: 'PBA206', location: 'SCMS Classroom', teacher: 'Adv. Vishal Jadhav', progress: 0 },
    { id: 'wed-1100-pba205', day: 'Wednesday', startTime: '11:00 AM', endTime: '12:00 PM', subjectTitle: 'Digital Transformation (T)', subjectCode: 'PBA205', location: 'Tutorial Room', teacher: 'Mr. Aniket Alvekar', progress: 0 },
    { id: 'wed-1200-pba207', day: 'Wednesday', startTime: '12:00 PM', endTime: '01:00 PM', subjectTitle: 'Data Visualization and Story Telling', subjectCode: 'PBA207', location: 'SCMS Classroom', teacher: 'Dr. Samadhan Bundhe', progress: 0 },
    { id: 'wed-1400-pba208', day: 'Wednesday', startTime: '02:00 PM', endTime: '03:00 PM', subjectTitle: 'Business Research Methods', subjectCode: 'PBA208', location: 'SCMS Classroom', teacher: 'Dr. Zahir Shaikh', progress: 0 },
    { id: 'wed-1500-pba211', day: 'Wednesday', startTime: '03:00 PM', endTime: '04:00 PM', subjectTitle: 'Data Analysis using Python (P)', subjectCode: 'PBA211', location: 'Python Lab', teacher: 'Mr. Aniket Alvekar', progress: 0 },
    { id: 'wed-1600-pba212', day: 'Wednesday', startTime: '04:00 PM', endTime: '05:00 PM', subjectTitle: 'Data Analysis using Power BI (P)', subjectCode: 'PBA212', location: 'Power BI Lab', teacher: 'Dr. Samadhan Bundhe', progress: 0 },

    { id: 'thu-1015-pba206', day: 'Thursday', startTime: '10:15 AM', endTime: '11:00 AM', subjectTitle: 'Legal Aspects of Business', subjectCode: 'PBA206', location: 'SCMS Classroom', teacher: 'Adv. Vishal Jadhav', progress: 0 },
    { id: 'thu-1100-pba204', day: 'Thursday', startTime: '11:00 AM', endTime: '12:00 PM', subjectTitle: 'Production and Operations Management', subjectCode: 'PBA204', location: 'SCMS Classroom', teacher: 'Dr. Shailendra Baraniya', progress: 0 },
    { id: 'thu-1200-pba207', day: 'Thursday', startTime: '12:00 PM', endTime: '01:00 PM', subjectTitle: 'Data Visualization and Story Telling', subjectCode: 'PBA207', location: 'SCMS Classroom', teacher: 'Dr. Samadhan Bundhe', progress: 0 },
    { id: 'thu-1400-pba208', day: 'Thursday', startTime: '02:00 PM', endTime: '03:00 PM', subjectTitle: 'Business Research Methods', subjectCode: 'PBA208', location: 'SCMS Classroom', teacher: 'Dr. Zahir Shaikh', progress: 0 },
    { id: 'thu-1500-pba211', day: 'Thursday', startTime: '03:00 PM', endTime: '04:00 PM', subjectTitle: 'Data Analysis using Python (P)', subjectCode: 'PBA211', location: 'Python Lab', teacher: 'Mr. Aniket Alvekar', progress: 0 },
    { id: 'thu-1600-pba213', day: 'Thursday', startTime: '04:00 PM', endTime: '05:00 PM', subjectTitle: 'Business Communication Skills - II (P)', subjectCode: 'PBA213', location: 'Communication Lab', teacher: 'Dr. Samadhan Bundhe / FR', progress: 0 },

    { id: 'fri-1015-pba204', day: 'Friday', startTime: '10:15 AM', endTime: '11:00 AM', subjectTitle: 'Production and Operations Management', subjectCode: 'PBA204', location: 'SCMS Classroom', teacher: 'Dr. Shailendra Baraniya', progress: 0 },
    { id: 'fri-1100-pba205', day: 'Friday', startTime: '11:00 AM', endTime: '12:00 PM', subjectTitle: 'Digital Transformation', subjectCode: 'PBA205', location: 'SCMS Classroom', teacher: 'Mr. Aniket Alvekar', progress: 0 },
    { id: 'fri-1200-pba207', day: 'Friday', startTime: '12:00 PM', endTime: '01:00 PM', subjectTitle: 'Data Visualization and Story Telling (P)', subjectCode: 'PBA207', location: 'Visualization Lab', teacher: 'Dr. Samadhan Bundhe', progress: 0 },
    { id: 'fri-1400-pba208', day: 'Friday', startTime: '02:00 PM', endTime: '03:00 PM', subjectTitle: 'Business Research Methods', subjectCode: 'PBA208', location: 'SCMS Classroom', teacher: 'Dr. Zahir Shaikh', progress: 0 },
    { id: 'fri-1500-pba212', day: 'Friday', startTime: '03:00 PM', endTime: '04:00 PM', subjectTitle: 'Data Analysis using Power BI (P)', subjectCode: 'PBA212', location: 'Power BI Lab', teacher: 'Dr. Samadhan Bundhe', progress: 0 },
    { id: 'fri-1600-pba213', day: 'Friday', startTime: '04:00 PM', endTime: '05:00 PM', subjectTitle: 'Business Communication Skills - II (P)', subjectCode: 'PBA213', location: 'Communication Lab', teacher: 'Dr. Samadhan Bundhe / FR', progress: 0 }
];

interface AppState {
    bookmarks: Bookmark[];
    weeklyGoalHours: number;
    studySessions: StudySession[];
    recentlyOpened: string[]; // IDs
    unitProgress: Record<string, boolean>; // unitId -> isCompleted
    timetable: TimetableEntry[];
    announcements: Announcement[];
    isRightPanelMinimized: boolean;

    // Actions
    addBookmark: (itemId: string, type: Bookmark['type']) => void;
    removeBookmark: (itemId: string) => void;
    setWeeklyGoal: (hours: number) => void;
    addStudySession: (session: StudySession) => void;
    markUnitComplete: (unitId: string, completed: boolean) => void;
    addToRecent: (id: string) => void;

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
        }),
        {
            name: 'curriculab-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
