"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useFocusSession } from '@/hooks/useFocusSession';

type TimerMode = 'stopwatch' | 'timer' | 'clock';

interface FocusTimerProps {
    onStatsRequest?: (setOpen: boolean) => void;
}

export function FocusTimer({ onStatsRequest }: FocusTimerProps) {
    const [mode, setMode] = useState<TimerMode>('clock');

    // Stopwatch state
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isStopwatchActive, setIsStopwatchActive] = useState(false);

    // Timer state
    const [timerDuration, setTimerDuration] = useState(25 * 60); // Default 25 mins
    const [timerTime, setTimerTime] = useState(25 * 60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(25);

    // Clock state
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fullscreen state
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const timerContainerRef = useRef<HTMLDivElement>(null);

    // Session tracking
    const { startSession, endSession, getStats } = useFocusSession();

    // Pomodoro state
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [isBreakTime, setIsBreakTime] = useState(false);
    const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);

    // Save pomodoroCount to localStorage
    useEffect(() => {
        localStorage.setItem('focusPomodoroCount', pomodoroCount.toString());
    }, [pomodoroCount]);

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

                        // Track session completion
                        if (!isBreakTime) {
                            const duration = Math.floor(timerDuration / 60); // in minutes
                            endSession(timerDuration, true);

                            // Pomodoro logic: suggest breaks
                            const newPomodoroCount = pomodoroCount + 1;
                            setPomodoroCount(newPomodoroCount);

                            // Every 4 pomodoros = long break (15 min), otherwise short break (5 min)
                            const isLongBreak = newPomodoroCount % 4 === 0;
                            setShowBreakSuggestion(true);

                            toast.success(isLongBreak
                                ? "🎉 4 sessions complete! Time for a long break!"
                                : "✅ Focus session completed! Time for a short break!");
                        } else {
                            toast.success("Break complete! Ready for another session?");
                            setIsBreakTime(false);
                        }

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
    }, [isTimerActive, mode, isBreakTime, pomodoroCount, timerDuration, endSession]);

    // Clock Logic
    useEffect(() => {
        if (mode === 'clock') {
            // Update immediately when entering clock mode
            setCurrentTime(new Date());

            // Then update every second
            intervalRef.current = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [mode]);

    // Fullscreen Logic
    const toggleFullscreen = () => {
        if (!timerContainerRef.current) return;

        if (!isFullscreen) {
            timerContainerRef.current.requestFullscreen().catch((err) => {
                console.error('Error attempting to enable fullscreen:', err);
                toast.error('Fullscreen mode not supported');
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Load preferences from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem('focusMode') as TimerMode;
        const savedDarkMode = localStorage.getItem('focusDarkMode');
        const savedTimerDuration = localStorage.getItem('focusTimerDuration');

        if (savedMode && ['stopwatch', 'timer', 'clock'].includes(savedMode)) {
            setMode(savedMode);
        }
        if (savedDarkMode) {
            setIsDarkMode(savedDarkMode === 'true');
        }
        if (savedTimerDuration) {
            const duration = parseInt(savedTimerDuration);
            setCustomMinutes(duration);
            setTimerDuration(duration * 60);
            setTimerTime(duration * 60);
        }
    }, []);

    // Save preferences to localStorage when they change
    useEffect(() => {
        localStorage.setItem('focusMode', mode);
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('focusDarkMode', isDarkMode.toString());
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem('focusTimerDuration', customMinutes.toString());
    }, [customMinutes]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case ' ': // Space - Play/Pause
                    e.preventDefault();
                    if (mode === 'stopwatch') toggleStopwatch();
                    else if (mode === 'timer') toggleTimer();
                    break;
                case 'r': // R - Reset
                    e.preventDefault();
                    if (mode === 'stopwatch') resetStopwatch();
                    else if (mode === 'timer') resetTimer();
                    break;
                case 'f': // F - Toggle fullscreen
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'd': // D - Toggle dark mode (in fullscreen)
                    if (isFullscreen) {
                        e.preventDefault();
                        setIsDarkMode(!isDarkMode);
                    }
                    break;
                case '1': // 1 - Clock mode
                    e.preventDefault();
                    setMode('clock');
                    break;
                case '2': // 2 - Stopwatch mode
                    e.preventDefault();
                    setMode('stopwatch');
                    break;
                case '3': // 3 - Timer mode
                    e.preventDefault();
                    setMode('timer');
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [mode, isFullscreen, isDarkMode, isStopwatchActive, isTimerActive]);

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

    const startBreak = (minutes: number) => {
        setIsBreakTime(true);
        setShowBreakSuggestion(false);
        setTimerDuration(minutes * 60);
        setTimerTime(minutes * 60);
        setIsTimerActive(true);
    };

    const dismissBreakSuggestion = () => {
        setShowBreakSuggestion(false);
    };

    const formatTime = (seconds: number) => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    const formatClockTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const getMinutes = `0${minutes}`.slice(-2);
        const getSeconds = `0${seconds}`.slice(-2);
        const getHours = `0${hours}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    const getDateString = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div
            ref={timerContainerRef}
            className={cn(
                "rounded-3xl p-8 shadow-sm border flex flex-col items-center justify-center min-h-[400px] h-full relative transition-colors duration-300",
                isFullscreen && isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-100"
            )}
        >

            {/* Mode Switcher */}
            <div className={cn(
                "absolute top-6 left-1/2 -translate-x-1/2 flex p-1 rounded-xl",
                isFullscreen && isDarkMode ? "bg-gray-800" : "bg-gray-100"
            )}>
                <button
                    onClick={() => setMode('clock')}
                    className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        mode === 'clock'
                            ? "bg-white text-blue-600 shadow-sm"
                            : isFullscreen && isDarkMode
                                ? "text-gray-400 hover:text-gray-200"
                                : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Clock
                </button>
                <button
                    onClick={() => setMode('stopwatch')}
                    className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        mode === 'stopwatch'
                            ? "bg-white text-blue-600 shadow-sm"
                            : isFullscreen && isDarkMode
                                ? "text-gray-400 hover:text-gray-200"
                                : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Stopwatch
                </button>
                <button
                    onClick={() => setMode('timer')}
                    className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        mode === 'timer'
                            ? "bg-white text-blue-600 shadow-sm"
                            : isFullscreen && isDarkMode
                                ? "text-gray-400 hover:text-gray-200"
                                : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Timer
                </button>
            </div>

            {/* Fullscreen & Dark Mode Toggles */}
            <div className="absolute top-6 right-6 flex gap-2">
                {/* Dark Mode Toggle - Only visible in fullscreen */}
                {isFullscreen && (
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-105",
                            isDarkMode
                                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                        title={isDarkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {isDarkMode ? (
                            <Icons.Sun size={20} />
                        ) : (
                            <Icons.Moon size={20} />
                        )}
                    </button>
                )}

                {/* Fullscreen Toggle */}
                <button
                    onClick={toggleFullscreen}
                    className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-105",
                        isFullscreen && isDarkMode
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? (
                        <Icons.Minimize size={20} />
                    ) : (
                        <Icons.Maximize size={20} />
                    )}
                </button>
            </div>

            <div className={cn(
                "flex items-center gap-2 mb-8 mt-8 px-4 py-1.5 rounded-full",
                isFullscreen && isDarkMode
                    ? "text-blue-400 bg-blue-900/30"
                    : "text-blue-600 bg-blue-50"
            )}>
                <Icons.Clock size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">
                    {mode === 'stopwatch' ? 'Deep Focus Mode' : mode === 'timer' ? 'Countdown Timer' : 'Current Time'}
                </span>
            </div>

            {mode === 'clock' ? (
                <>
                    <div className={cn(
                        "text-8xl md:text-9xl font-black font-mono tracking-tighter mb-4 tabular-nums",
                        isFullscreen && isDarkMode ? "text-gray-100" : "text-gray-900"
                    )}>
                        {formatClockTime(currentTime)}
                    </div>
                    <p className={cn(
                        "text-xl font-medium mb-8",
                        isFullscreen && isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                        {getDateString(currentTime)}
                    </p>
                </>
            ) : (
                <div className={cn(
                    "text-8xl md:text-9xl font-black font-mono tracking-tighter mb-8 tabular-nums",
                    isFullscreen && isDarkMode ? "text-gray-100" : "text-gray-900"
                )}>
                    {formatTime(mode === 'stopwatch' ? stopwatchTime : timerTime)}
                </div>
            )}

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
                                    : isFullscreen && isDarkMode
                                        ? "border-gray-700 text-gray-400 hover:border-gray-600"
                                        : "border-gray-100 text-gray-500 hover:border-gray-300"
                            )}
                        >
                            {m}m
                        </button>
                    ))}
                </div>
            )}

            {/* Controls - Hidden for Clock Mode */}
            {mode !== 'clock' && (
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
                        className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                            isFullscreen && isDarkMode
                                ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                    >
                        <Icons.RotateCcw size={24} />
                    </button>
                </div>
            )}

            <p className={cn(
                "mt-8 text-sm font-medium",
                isFullscreen && isDarkMode ? "text-gray-500" : "text-gray-400"
            )}>
                {mode === 'clock'
                    ? "Every moment is a fresh beginning."
                    : (mode === 'stopwatch' ? isStopwatchActive : isTimerActive)
                        ? "Stay focused. You're doing great!"
                        : "Ready to start your session?"}
            </p>

            {/* Keyboard Shortcuts Hint */}
            {!isFullscreen && (
                <p className="mt-2 text-xs text-gray-400">
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">Space</span> Play/Pause ·
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded ml-1">R</span> Reset ·
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded ml-1">F</span> Fullscreen ·
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded ml-1">1-3</span> Switch Mode
                </p>
            )}

            {/* Break Suggestion Modal */}
            {showBreakSuggestion && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
                        <div className="text-5xl mb-4">{pomodoroCount % 4 === 0 ? '🎉' : '☕'}</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {pomodoroCount % 4 === 0 ? 'Great Work!' : 'Time for a Break!'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {pomodoroCount % 4 === 0
                                ? "You've completed 4 focus sessions. Take a longer break to recharge!"
                                : "You've earned a short break. Step away and refresh your mind!"}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => startBreak(pomodoroCount % 4 === 0 ? 15 : 5)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                            >
                                {pomodoroCount % 4 === 0 ? '15 Min Break' : '5 Min Break'}
                            </button>
                            <button
                                onClick={dismissBreakSuggestion}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Break Mode Indicator */}
            {isBreakTime && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    ☕ Break Time
                </div>
            )}
        </div>
    );
}
