"use client"

import React, { useEffect, useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { KPIStatCard } from '@/components/web/KPIStatCard';
import { TimetableWidget } from '@/components/web/TimetableWidget';
import { Icons } from '@/components/shared/Icons';
import { useAppStore } from '@/lib/store/useAppStore';
import { AnnouncementWidget } from './AnnouncementWidget';
import { cn } from '@/lib/utils';
import { getAnnouncements } from '@/lib/services/announcement-service';
import { getTimetable } from '@/lib/services/timetable-service';
import { useSemester } from '@/components/providers/SemesterProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { Subject, Assignment } from '@/types';
import { getAssignments, getSemesterAssignments, createAssignment } from '@/lib/services/app.service';
import { SubjectService } from '@/lib/data/subject-service';
import { useToast } from '@/components/shared/Toast';
import { AssignmentModal } from './AssignmentModal';
import { TasksWidget } from './TasksWidget';
import { SubjectProgressWidget } from './SubjectProgressWidget';
import { StudyTrackerWidget } from './StudyTrackerWidget';
import { QuickAccessWidget } from './QuickAccessWidget';

export default function WebHomePage() {
    const timetable = useAppStore(state => state.timetable);
    const announcements = useAppStore(state => state.announcements);
    const setAnnouncements = useAppStore(state => state.setAnnouncements);
    const setTimetable = useAppStore(state => state.setTimetable);
    const { activeSemester, activeSemesterId, allSemesters, setActiveSemester } = useSemester();
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();
    const [completedAssignments, setCompletedAssignments] = useState<Set<string>>(new Set());
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const { showToast } = useToast();
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const setAnalyticaOpen = useAppStore(state => state.setAnalyticaOpen);
    useEffect(() => {
        setMounted(true);
    }, []);

    const getDisplayName = () => {
        if (!user) return 'Student';
        if (user.user_metadata?.full_name) return user.user_metadata.full_name;
        if (user.email) {
            const name = user.email.split('@')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return 'Student';
    };
    const displayName = getDisplayName();

    const handleSaveAssignment = async (data: Partial<Assignment>) => {
        try {
            const newAssignment = await createAssignment({
                id: crypto.randomUUID(),
                title: data.title || 'Untitled',
                description: data.description || '',
                questions: data.questions || [],
                subjectId: data.subjectId || (subjects.length > 0 ? subjects[0].id : ''),
                dueDate: data.dueDate || new Date().toISOString().split('T')[0],
                unitId: data.unitId || undefined,
                platform: data.platform
            } as Assignment);

            // Refetch or update local assignments list
            setAssignments(prev => [...prev, newAssignment]);
            showToast('Assignment created successfully!', 'success');

            // Trigger push notification to class students
            fetch('/api/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'New Assignment Created',
                    message: `A new assignment "${newAssignment.title}" has been created. Due Date: ${newAssignment.dueDate}`,
                    url: '/assignments',
                    targetSemesterId: activeSemesterId
                })
            }).catch(console.error);
        } catch (error) {
            console.error("Failed to save assignment:", error);
            showToast('Failed to save assignment', 'error');
        }
        setIsAssignmentModalOpen(false);
    };

    // Load completed assignments
    useEffect(() => {
        const loadCompletions = async () => {
            if (!user) {
                setCompletedAssignments(new Set());
                return;
            }
            try {
                const { supabase } = await import('@/utils/supabase/client');
                const { data, error } = await supabase
                    .from('user_completed_assignments')
                    .select('assignment_id')
                    .eq('user_id', user.id);
                if (error) {
                    console.error("Error loading completions:", error);
                } else if (data) {
                    setCompletedAssignments(new Set(data.map((d: any) => d.assignment_id)));
                }
            } catch (error) {
                console.error("Exception loading completions:", error);
            }
        };
        loadCompletions();
    }, [user]);

    // Fetch assignments and subjects
    useEffect(() => {
        if (!mounted) return;
        const loadAssignmentsAndSubjects = async () => {
            if (!activeSemesterId) {
                setAssignments([]);
                setSubjects([]);
                setLoadingAssignments(false);
                return;
            }
            setLoadingAssignments(true);
            try {
                const fetchedSubjects = await SubjectService.getAll(activeSemesterId);
                setSubjects(fetchedSubjects);
                
                const semesterAssignments = await getSemesterAssignments(activeSemesterId);
                setAssignments(semesterAssignments);
            } catch (error) {
                console.error("Failed to load assignments and subjects:", error);
            } finally {
                setLoadingAssignments(false);
            }
        };
        loadAssignmentsAndSubjects();
    }, [activeSemesterId, mounted]);

    const toggleCompletion = async (assignmentId: string) => {
        if (!user) return;
        
        try {
            const { supabase } = await import('@/utils/supabase/client');
            const isCompleted = completedAssignments.has(assignmentId);
            
            // Optimistic update
            setCompletedAssignments(prev => {
                const next = new Set(prev);
                if (isCompleted) next.delete(assignmentId);
                else next.add(assignmentId);
                return next;
            });

            if (isCompleted) {
                await supabase
                    .from('user_completed_assignments')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('assignment_id', assignmentId);
            } else {
                await supabase
                    .from('user_completed_assignments')
                    .insert({ user_id: user.id, assignment_id: assignmentId });
            }
        } catch (error) {
            console.error("Failed to toggle completion:", error);
        }
    };

    const completedCount = assignments.filter(a => completedAssignments.has(a.id)).length;
    const pendingAssignments = assignments.filter(a => !completedAssignments.has(a.id));

    useEffect(() => {
        if (!mounted) return;
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements(activeSemesterId ?? undefined);
                setAnnouncements(data);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            }
        };
        fetchAnnouncements();
    }, [setAnnouncements, activeSemesterId, mounted]);

    useEffect(() => {
        if (!mounted) return;
        const fetchTimetable = async () => {
            try {
                const entries = await getTimetable(activeSemesterId ?? undefined);
                setTimetable(entries || []);
            } catch (error) {
                console.error('Failed to fetch timetable:', error);
            }
        };
        fetchTimetable();
    }, [setTimetable, activeSemesterId, mounted]);


    return (
        <WebAppShell>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1600px] mx-auto space-y-6">
                
                {mounted ? (
                    <>
                        {/* Top Stat Cards - 4 Column Grid on Mobile */}
                        <div className="grid grid-cols-4 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 w-[100vw] -ml-4 px-4 md:w-auto md:ml-0 md:px-0 lg:-ml-8 lg:px-8 xl:ml-0 xl:px-0 mb-4 md:mb-0">
                            <div className="w-full">
                                <KPIStatCard
                                    label="Classes Today"
                                value={timetable.length > 0 ? timetable.length : 0}
                                icon="Calendar"
                                />
                            </div>
                            <div className="w-full">
                                <KPIStatCard
                                    label="Enrolled Subjects"
                                    value={subjects.length}
                                    icon="BookOpen"
                                    color="#d946ef"
                                />
                            </div>
                            <div className="w-full">
                                <KPIStatCard
                                    label="Pending Tasks"
                                    value={pendingAssignments.length}
                                    icon="Clock"
                                    color="#f43f5e"
                                />
                            </div>
                            <div className="w-full">
                                <KPIStatCard
                                    label="Tasks Completed"
                                    value={completedCount}
                                    icon="CheckCircle"
                                    color="#14b8a6"
                                    progress={assignments.length > 0 ? (completedCount / assignments.length) * 100 : 0}
                                />
                            </div>
                        </div>

                        {/* Main Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* Academic Roadmap (Left, 7 columns) */}
                            <div className="lg:col-span-7 flex flex-col min-h-0">
                                <TimetableWidget entries={timetable} />
                            </div>

                            {/* Right Side (Desktop, 5 columns, constrained height) */}
                            <div className="hidden lg:block lg:col-span-5 relative min-h-0">
                                <div className="absolute inset-0 flex flex-col gap-6">
                                    <QuickAccessWidget onOpenAnalytica={() => setAnalyticaOpen(true)} />
                                    <TasksWidget 
                                        assignments={assignments}
                                        completedAssignments={completedAssignments}
                                        onToggleCompletion={toggleCompletion}
                                        onAddClick={user ? () => setIsAssignmentModalOpen(true) : undefined}
                                    />
                                </div>
                            </div>

                            {/* Right Side (Mobile, normal flow) */}
                            <div className="lg:hidden col-span-1 flex flex-col gap-6 min-h-0">
                                <TasksWidget 
                                    assignments={assignments}
                                    completedAssignments={completedAssignments}
                                    onToggleCompletion={toggleCompletion}
                                    onAddClick={user ? () => setIsAssignmentModalOpen(true) : undefined}
                                />
                            </div>

                        </div>



                        {/* Bottom Row: Announcements */}
                        <div className="w-full">
                            <AnnouncementWidget announcements={announcements} />
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="h-32 bg-gray-50/50 rounded-[32px] border border-gray-100/50 animate-pulse flex items-center justify-center" />
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-7 h-[500px] bg-gray-50/50 rounded-[32px] border border-gray-100/50 animate-pulse flex items-center justify-center" />
                            <div className="lg:col-span-5 h-[500px] bg-gray-50/50 rounded-[32px] border border-gray-100/50 animate-pulse flex items-center justify-center" />
                        </div>
                    </div>
                )}
            </div>

            <AssignmentModal
                isOpen={isAssignmentModalOpen}
                onClose={() => setIsAssignmentModalOpen(false)}
                onSave={handleSaveAssignment}
                subjects={subjects}
            />
        </WebAppShell>
    );
}
