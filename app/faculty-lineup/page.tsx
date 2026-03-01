"use client"

import React, { useEffect, useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { FacultyLineup } from '@/components/web/FacultyLineup';
import { getTimetable } from '@/lib/services/timetable-service';
import { FacultyService, Person } from '@/lib/data/faculty-service';
import { TimetableEntry } from '@/types';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';

export default function FacultyLineupPage() {
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [faculty, setFaculty] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [timetableData, facultyData] = await Promise.all([
                    getTimetable(),
                    FacultyService.getAll()
                ]);

                if (timetableData) setEntries(timetableData);
                if (facultyData) setFaculty(facultyData.filter(p => p.category === 'faculty'));
            } catch (error) {
                console.error('Failed to fetch data for faculty lineup:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <WebAppShell>
            <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-4">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Instructors</h1>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">Faculty Lineup</p>
                        <p className="text-sm text-gray-500 mt-1">Meet your professors and fellows</p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm w-fit"
                    >
                        <Icons.ArrowLeft size={16} />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <FacultyLineup entries={entries} faculty={faculty} />
                )}
            </div>
        </WebAppShell>
    );
}
