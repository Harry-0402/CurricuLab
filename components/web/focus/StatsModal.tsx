"use client"

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { useFocusSession } from '@/hooks/useFocusSession';

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
    const { getStats } = useFocusSession();
    const [pomodoroCount, setPomodoroCount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            // Fetch pomodoro count from localStorage
            const saved = localStorage.getItem('focusPomodoroCount');
            if (saved) {
                setPomodoroCount(parseInt(saved));
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const stats = getStats();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-900">📊 Focus Statistics</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all"
                    >
                        <Icons.X size={20} />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
                        <p className="text-xs text-blue-600 mb-2 font-semibold uppercase tracking-wide">Today</p>
                        <p className="text-3xl font-black text-blue-700 mb-1">{stats.todaySessions}</p>
                        <p className="text-xs text-blue-600">{Math.floor(stats.todayTotalTime / 60)} min</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-2xl border border-indigo-200">
                        <p className="text-xs text-indigo-600 mb-2 font-semibold uppercase tracking-wide">This Week</p>
                        <p className="text-3xl font-black text-indigo-700 mb-1">{stats.weekSessions}</p>
                        <p className="text-xs text-indigo-600">{Math.floor(stats.weekTotalTime / 60)} min</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl border border-orange-200">
                        <p className="text-xs text-orange-600 mb-2 font-semibold uppercase tracking-wide">Current Streak</p>
                        <p className="text-3xl font-black text-orange-700 mb-1">{stats.currentStreak} 🔥</p>
                        <p className="text-xs text-orange-600">day{stats.currentStreak !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl border border-green-200">
                        <p className="text-xs text-green-600 mb-2 font-semibold uppercase tracking-wide">Pomodoros</p>
                        <p className="text-3xl font-black text-green-700 mb-1">{pomodoroCount}</p>
                        <p className="text-xs text-green-600">completed</p>
                    </div>
                </div>

                {/* Additional Stats */}
                {stats.longestStreak > 0 && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 mb-4">
                        <p className="text-sm text-purple-700">
                            <span className="font-bold">Longest Streak:</span> {stats.longestStreak} day{stats.longestStreak !== 1 ? 's' : ''} 🏆
                        </p>
                    </div>
                )}

                {/* Motivational Message */}
                <p className="text-center text-gray-500 text-sm">
                    {stats.currentStreak >= 7
                        ? "Amazing! You're on fire! 🔥"
                        : stats.todaySessions >= 4
                            ? "Great work today! Keep it up! 💪"
                            : "Every session counts. Keep going! ✨"}
                </p>
            </div>
        </div>
    );
}
