"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';
import { WebAppShell } from '@/components/web/WebAppShell';
import { SubjectCard } from '@/components/web/SubjectCard';
import { Subject } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/shared/Dialog";

import { SubjectService } from '@/lib/data/subject-service';
import { useSemester } from '@/components/providers/SemesterProvider';
import { useAuth } from '@/components/providers/AuthProvider';


export default function WebSubjectsContent() {
    // State
    const [subjects, setSubjects] = React.useState<Subject[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { user } = useAuth();
    const { activeSemesterId, activeSemester, enrolledSemesterId, isBrowsing } = useSemester();

    const fetchSubjects = async () => {
        try {
            // Pass the active semester ID to filter subjects
            const data = await SubjectService.getAll(activeSemesterId ?? undefined);
            setSubjects(data);
        } catch (error) {
            console.error("Failed to load subjects", error);
        } finally {
            setIsLoading(false);
        }
    };


    React.useEffect(() => {
        setIsLoading(true);
        fetchSubjects();

        // Set up real-time subscription
        const subscription = SubjectService.subscribeToChanges(
            (newSubject) => {
                if (activeSemesterId && newSubject.semesterId !== activeSemesterId) return;
                setSubjects(prev => {
                    if (prev.some(s => s.id === newSubject.id)) return prev;
                    return [...prev, newSubject];
                });
            },
            (updatedSubject) => {
                if (activeSemesterId && updatedSubject.semesterId !== activeSemesterId) {
                    // If a subject was moved to another semester, remove it from current view
                    setSubjects(prev => prev.filter(s => s.id !== updatedSubject.id));
                    return;
                }
                setSubjects(prev => {
                    if (prev.some(s => s.id === updatedSubject.id)) {
                        return prev.map(s => s.id === updatedSubject.id ? updatedSubject : s);
                    }
                    // If it was moved into this semester, add it
                    return [...prev, updatedSubject];
                });
            },
            (deletedId) => {
                setSubjects(prev => prev.filter(s => s.id !== deletedId));
            }
        );

        return () => { subscription.unsubscribe(); };
        // Re-fetch when active semester changes
    }, [activeSemesterId]);




    return (
        <WebAppShell>
            <div className="space-y-8">
                {/* Browsing Banner */}
                {isBrowsing && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Icons.Info size={18} className="text-amber-500 shrink-0" />
                            <p className="text-sm font-semibold text-amber-800">
                                You are browsing <strong>{activeSemester?.name}</strong>. Switch to your class to see your personal content.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h2>
                        <p className="text-gray-500">
                            {activeSemester ? `${activeSemester.name}` : 'All Subjects'}
                            {subjects.length > 0 && ` · ${subjects.length} subjects`}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:space-y-0">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-20 sm:h-48 bg-gray-100 rounded-2xl sm:rounded-[32px] animate-pulse" />
                        ))}
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Icons.BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-semibold">No subjects found for this semester.</p>
                        <p className="text-sm mt-1">An admin can add subjects from the Admin Panel.</p>
                    </div>
                ) : (
                    <div className="space-y-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:space-y-0">
                        {subjects.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                            />
                        ))}
                    </div>
                )}


            </div>
        </WebAppShell>
    );
}
