import React from 'react';
import { cn } from '@/lib/utils';
import { SubjectAttendanceStats } from '@/lib/services/attendance-service';

interface AttendanceStatsProps {
    stats: SubjectAttendanceStats[];
    loading: boolean;
}

export function AttendanceStatsCard({ stats, loading }: AttendanceStatsProps) {
    const totalClasses = stats.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const totalPresent = stats.reduce((acc, curr) => acc + curr.presentClasses, 0);
    const actualOverall = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

    return (
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900">Attendance Overview</h3>
                <div className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    Semester Total
                </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="stroke-gray-100" strokeWidth="8" fill="none" />
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            className={cn("transition-all duration-1000 ease-out",
                                actualOverall >= 80 ? "stroke-green-500" : actualOverall >= 60 ? "stroke-yellow-500" : "stroke-red-500"
                            )}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * actualOverall) / 100}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-gray-900">{actualOverall}%</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-500">Total Classes: <span className="text-gray-900">{totalClasses}</span></p>
                    <p className="text-sm font-bold text-gray-500">Present: <span className="text-gray-900">{totalPresent}</span></p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Target: 80%</p>
                </div>
            </div>

            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {stats.length === 0 && !loading && <p className="text-sm text-gray-400 text-center py-4">No attendance data yet.</p>}
                {stats.map(stat => (
                    <div key={stat.subjectId} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700 truncate w-1/2" title={stat.subjectName}>{stat.subjectName}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-xs">{stat.presentClasses}/{stat.totalClasses}</span>
                            <span className={cn("font-bold w-8 text-right",
                                stat.percentage >= 80 ? "text-green-600" : stat.percentage >= 60 ? "text-yellow-600" : "text-red-600"
                            )}>
                                {stat.percentage}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
