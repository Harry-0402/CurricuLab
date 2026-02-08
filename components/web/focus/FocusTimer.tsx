"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TimerMode = 'stopwatch' | 'timer';

export function FocusTimer() {
    const [mode, setMode] = useState<TimerMode>('stopwatch');

    // Stopwatch state
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isStopwatchActive, setIsStopwatchActive] = useState(false);

    // Timer state
    const [timerDuration, setTimerDuration] = useState(25 * 60); // Default 25 mins
    const [timerTime, setTimerTime] = useState(25 * 60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(25);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Stopwatch Logic
    useEffect(() => {
        if (isStopwatchActive && mode === 'stopwatch') {
            intervalRef.current = setInterval(() => {
                setStopwatchTime((prev) => prev + 1);
            }, 1000);
        } else if (mode === 'stopwatch') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isStopwatchActive, mode]);

    // Timer Logic
    useEffect(() => {
        if (isTimerActive && mode === 'timer') {
            intervalRef.current = setInterval(() => {
                setTimerTime((prev) => {
                    if (prev <= 0) {
                        setIsTimerActive(false);
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        new Audio('/notification.mp3').play().catch(() => { }); // Optional: Play sound if available
                        toast.success("Focus session completed!");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (mode === 'timer') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isTimerActive, mode]);

    const toggleStopwatch = () => setIsStopwatchActive(!isStopwatchActive);
    const resetStopwatch = () => {
        setIsStopwatchActive(false);
        setStopwatchTime(0);
    };

    const toggleTimer = () => setIsTimerActive(!isTimerActive);
    const resetTimer = () => {
        setIsTimerActive(false);
        setTimerTime(timerDuration);
    };

    const handleSetDuration = (minutes: number) => {
        setCustomMinutes(minutes);
        setTimerDuration(minutes * 60);
        setTimerTime(minutes * 60);
        setIsTimerActive(false);
    };

    const formatTime = (seconds: number) => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px] h-full relative">

            {/* Mode Switcher */}
            <div className="absolute top-6 flex bg-gray-100 p-1 rounded-xl">
                <button
                    onClick={() => setMode('stopwatch')}
                    className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        mode === 'stopwatch' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Stopwatch
                </button>
                <button
                    onClick={() => setMode('timer')}
                    className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        mode === 'timer' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Timer
                </button>
            </div>

            <div className="flex items-center gap-2 mb-8 mt-8 text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                <Icons.Clock size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">
                    {mode === 'stopwatch' ? 'Deep Focus Mode' : 'Countdown Timer'}
                </span>
            </div>

            <div className="text-8xl md:text-9xl font-black text-gray-900 font-mono tracking-tighter mb-8 tabular-nums">
                {formatTime(mode === 'stopwatch' ? stopwatchTime : timerTime)}
            </div>

            {/* Timer Quick Selects */}
            {mode === 'timer' && (
                <div className="flex gap-2 mb-8">
                    {[15, 25, 45, 60].map(m => (
                        <button
                            key={m}
                            onClick={() => handleSetDuration(m)}
                            className={cn(
                                "px-3 py-1 rounded-lg text-xs font-bold border transition-all",
                                customMinutes === m
                                    ? "bg-blue-50 border-blue-200 text-blue-600"
                                    : "border-gray-100 text-gray-500 hover:border-gray-300"
                            )}
                        >
                            {m}m
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-6">
                <button
                    onClick={mode === 'stopwatch' ? toggleStopwatch : toggleTimer}
                    className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-lg",
                        (mode === 'stopwatch' ? isStopwatchActive : isTimerActive)
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                >
                    {(mode === 'stopwatch' ? isStopwatchActive : isTimerActive)
                        ? <Icons.Pause size={32} fill="currentColor" />
                        : <Icons.Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <button
                    onClick={mode === 'stopwatch' ? resetStopwatch : resetTimer}
                    className="w-14 h-14 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-all"
                >
                    <Icons.RotateCcw size={24} />
                </button>
            </div>

            <p className="mt-8 text-gray-400 text-sm font-medium">
                {(mode === 'stopwatch' ? isStopwatchActive : isTimerActive)
                    ? "Stay focused. You're doing great!"
                    : "Ready to start your session?"}
            </p>
        </div>
    );
}
