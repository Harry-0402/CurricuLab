import { useState, useEffect } from 'react';

interface FocusSession {
    id: string;
    mode: 'stopwatch' | 'timer';
    duration: number; // in seconds
    timestamp: number; // Unix timestamp
    completed: boolean;
}

interface SessionStats {
    todaySessions: number;
    todayTotalTime: number;
    weekSessions: number;
    weekTotalTime: number;
    currentStreak: number;
    longestStreak: number;
}

export function useFocusSession() {
    const [sessions, setSessions] = useState<FocusSession[]>([]);
    const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);

    // Load sessions from localStorage on mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('focusSessions');
        if (savedSessions) {
            setSessions(JSON.parse(savedSessions));
        }
    }, []);

    // Save sessions to localStorage when they change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('focusSessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    const startSession = (mode: 'stopwatch' | 'timer') => {
        const session: FocusSession = {
            id: Date.now().toString(),
            mode,
            duration: 0,
            timestamp: Date.now(),
            completed: false
        };
        setCurrentSession(session);
    };

    const endSession = (duration: number, completed: boolean = true) => {
        if (currentSession) {
            const finishedSession = {
                ...currentSession,
                duration,
                completed
            };
            setSessions(prev => [...prev, finishedSession]);
            setCurrentSession(null);
        }
    };

    const getStats = (): SessionStats => {
        const now = Date.now();
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const weekStart = now - 7 * 24 * 60 * 60 * 1000;

        const todaySessions = sessions.filter(s => s.timestamp >= todayStart && s.completed);
        const weekSessions = sessions.filter(s => s.timestamp >= weekStart && s.completed);

        const todayTotalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
        const weekTotalTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);

        // Calculate streak (consecutive days with at least one session)
        const { currentStreak, longestStreak } = calculateStreaks(sessions);

        return {
            todaySessions: todaySessions.length,
            todayTotalTime,
            weekSessions: weekSessions.length,
            weekTotalTime,
            currentStreak,
            longestStreak
        };
    };

    const clearHistory = () => {
        setSessions([]);
        localStorage.removeItem('focusSessions');
    };

    return {
        currentSession,
        startSession,
        endSession,
        getStats,
        clearHistory,
        allSessions: sessions
    };
}

function calculateStreaks(sessions: FocusSession[]): { currentStreak: number; longestStreak: number } {
    if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // Group sessions by date
    const sessionsByDate = new Map<string, FocusSession[]>();
    sessions.forEach(session => {
        if (session.completed) {
            const date = new Date(session.timestamp).toDateString();
            if (!sessionsByDate.has(date)) {
                sessionsByDate.set(date, []);
            }
            sessionsByDate.get(date)!.push(session);
        }
    });

    const dates = Array.from(sessionsByDate.keys()).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    // Calculate current streak
    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const prevDate = i > 0 ? dates[i - 1] : null;

        if (i === 0 && (date === today || date === yesterday)) {
            currentStreak = 1;
        } else if (prevDate) {
            const daysDiff = Math.floor((new Date(prevDate).getTime() - new Date(date).getTime()) / (24 * 60 * 60 * 1000));
            if (daysDiff === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
        const daysDiff = Math.floor((new Date(dates[i]).getTime() - new Date(dates[i + 1]).getTime()) / (24 * 60 * 60 * 1000));
        if (daysDiff === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
}
