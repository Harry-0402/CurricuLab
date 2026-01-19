import React from 'react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { Subject } from '@/types';

interface MarkAttendanceFormProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    selectedSubject: string;
    onSubjectChange: (subId: string) => void;
    availableSubjects: Subject[];
    dayName: string;
    status: 'Present' | 'Absent' | 'Canceled';
    onStatusChange: (status: 'Present' | 'Absent' | 'Canceled') => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function MarkAttendanceForm({
    selectedDate,
    onDateChange,
    selectedSubject,
    onSubjectChange,
    availableSubjects,
    dayName,
    status,
    onStatusChange,
    isSubmitting,
    onSubmit
}: MarkAttendanceFormProps) {
    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl text-gray-900 mb-6">Mark Attendance</h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Date</label>
                        <input
                            type="date"
                            required
                            value={selectedDate}
                            onChange={(e) => onDateChange(e.target.value)}
                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => onSubjectChange(e.target.value)}
                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            disabled={availableSubjects.length === 0}
                        >
                            {availableSubjects.length === 0 ? (
                                <option value="">- No classes scheduled -</option>
                            ) : (
                                availableSubjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                ))
                            )}
                        </select>
                        {availableSubjects.length === 0 && (
                            <p className="text-xs text-orange-600 mt-1 font-medium">No subjects scheduled on {dayName}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl">
                    {(['Present', 'Absent', 'Canceled'] as const).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => onStatusChange(s)}
                            className={cn(
                                "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                                status === s
                                    ? (s === 'Present' ? "bg-green-100 text-green-700 shadow-sm" : s === 'Absent' ? "bg-red-100 text-red-700 shadow-sm" : "bg-gray-200 text-gray-700 shadow-sm")
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <Button type="submit" className="w-full rounded-xl py-6" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Log Attendance'}
                </Button>
            </form>
        </div>
    );
}
