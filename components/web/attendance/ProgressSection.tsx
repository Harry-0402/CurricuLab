import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { Reminder } from '@/lib/services/reminder-service';

interface ProgressSectionProps {
    streak: { currentStreak: number; longestStreak: number };
    reminders: Reminder[];
    onAddReminder: (title: string, date: string) => void;
    onToggleReminder: (id: string, isCompleted: boolean) => void;
    onDeleteReminder: (id: string) => void;
}

export function ProgressSection({
    streak,
    reminders,
    onAddReminder,
    onToggleReminder,
    onDeleteReminder
}: ProgressSectionProps) {
    const [progressTab, setProgressTab] = useState<'streak' | 'reminders'>('streak');
    const [newReminderTitle, setNewReminderTitle] = useState('');
    const [newReminderDate, setNewReminderDate] = useState('');
    const [newReminderTime, setNewReminderTime] = useState('');

    const handleAdd = () => {
        if (!newReminderTitle || !newReminderDate) return;
        const dateTime = newReminderTime ? `${newReminderDate}T${newReminderTime}` : newReminderDate;
        onAddReminder(newReminderTitle, dateTime);
        setNewReminderTitle('');
        setNewReminderDate('');
        setNewReminderTime('');
    };

    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            {/* Tab Switcher */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
                <button
                    onClick={() => setProgressTab('streak')}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                        progressTab === 'streak'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    🔥 Study Streak
                </button>
                <button
                    onClick={() => setProgressTab('reminders')}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                        progressTab === 'reminders'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    📝 Reminders
                </button>
            </div>

            {/* Tab Content */}
            {progressTab === 'streak' ? (
                <div className="space-y-3">
                    <div className="text-center py-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Current Streak</p>
                        <p className="text-4xl font-black text-orange-500 mb-2">{streak.currentStreak} Days</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                Longest Streak: <span className="text-gray-900 font-bold">{streak.longestStreak} days</span>
                            </span>
                        </div>
                    </div>
                    <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 text-center">
                        <p className="text-xs text-orange-700 font-medium">
                            {streak.currentStreak === 0
                                ? "Mark attendance today to start your streak!"
                                : streak.currentStreak >= 7
                                    ? "You're on fire! Keep it up! 🔥"
                                    : "Great consistency! Keep going! 🚀"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Reminder title..."
                            value={newReminderTitle}
                            onChange={(e) => setNewReminderTitle(e.target.value)}
                            className="flex-1 bg-gray-50 border-gray-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={newReminderDate}
                            onChange={(e) => setNewReminderDate(e.target.value)}
                            className="flex-1 bg-gray-50 border-gray-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <input
                            type="time"
                            value={newReminderTime}
                            onChange={(e) => setNewReminderTime(e.target.value)}
                            className="w-24 bg-gray-50 border-gray-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!newReminderTitle || !newReminderDate}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    <div className="max-h-[140px] overflow-y-auto space-y-2 pt-2 pr-1 custom-scrollbar">
                        {reminders.length === 0 ? (
                            <p className="text-xs text-center text-gray-400 py-4">No reminders yet</p>
                        ) : (
                            reminders.map(reminder => {
                                const daysUntil = differenceInDays(new Date(reminder.reminderDate), new Date());
                                // Try to format time if it exists
                                let timeDisplay = '';
                                try {
                                    if (reminder.reminderDate.includes('T') || reminder.reminderDate.includes(' ')) {
                                        timeDisplay = format(new Date(reminder.reminderDate), 'h:mm a');
                                    }
                                } catch (e) { }

                                return (
                                    <div key={reminder.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors">
                                        <button
                                            onClick={() => onToggleReminder(reminder.id, !reminder.isCompleted)}
                                            className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                                reminder.isCompleted
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "border-gray-300 hover:border-blue-500"
                                            )}
                                        >
                                            {reminder.isCompleted && <Icons.Check size={10} />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-xs font-medium truncate transition-all",
                                                reminder.isCompleted ? "text-gray-400 line-through" : "text-gray-700"
                                            )}>
                                                {reminder.title}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                <span>{format(new Date(reminder.reminderDate), 'MMM d')}</span>
                                                {timeDisplay && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{timeDisplay}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!reminder.isCompleted && (
                                                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded",
                                                    daysUntil < 0 ? "bg-red-50 text-red-600" :
                                                        daysUntil === 0 ? "bg-yellow-50 text-yellow-600" :
                                                            "bg-gray-100 text-gray-500"
                                                )}>
                                                    {daysUntil < 0 ? 'Overdue' : daysUntil === 0 ? 'Today' : `${daysUntil}d`}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => onDeleteReminder(reminder.id)}
                                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Icons.Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
