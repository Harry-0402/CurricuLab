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
import { Subject, Assignment } from '@/types';
import { getAssignments, getSemesterAssignments, createAssignment } from '@/lib/services/app.service';
import { SubjectService } from '@/lib/data/subject-service';
import { useToast } from '@/components/shared/Toast';
import { AssignmentModal } from './AssignmentModal';


export default function WebHomePage() {
    const timetable = useAppStore(state => state.timetable);
    const announcements = useAppStore(state => state.announcements);
    const setAnnouncements = useAppStore(state => state.setAnnouncements);
    const setTimetable = useAppStore(state => state.setTimetable);
    const { activeSemesterId } = useSemester();
    const [mounted, setMounted] = useState(false);
    const { user } = useAuth();
    const [completedAssignments, setCompletedAssignments] = useState<Set<string>>(new Set());
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const { showToast } = useToast();
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
    }, [activeSemesterId]);

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

    const pendingAssignments = assignments.filter(a => !completedAssignments.has(a.id));

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements(activeSemesterId ?? undefined);
                setAnnouncements(data);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            }
        };
        fetchAnnouncements();
    }, [setAnnouncements, activeSemesterId]);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const entries = await getTimetable(activeSemesterId ?? undefined);
                setTimetable(entries || []);
            } catch (error) {
                console.error('Failed to fetch timetable:', error);
            }
        };
        fetchTimetable();
    }, [setTimetable, activeSemesterId]);


    return (
        <WebAppShell>
            <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* ERP Attendance Guide */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[24px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                            <Icons.Info size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">Check Your Attendance on Sandip ERP</h3>
                            <p className="text-sm font-medium text-gray-600">
                                To view your official attendance records, please visit the <strong>Sandip ERP</strong> portal. Navigate to the <strong>Main Menu &gt; View Subject</strong> section.
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://www.sandipuniversity.edu.in/erp-login.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-200"
                    >
                        <span>Open Sandip ERP</span>
                        <Icons.ExternalLink size={16} />
                    </a>
                </div>

                {mounted ? (
                    <>
                        <TimetableWidget entries={timetable} />

                        {/* Pending Assignments Section */}
                        <div className="space-y-10">
                            {/* Header */}
                            <div className="flex items-center justify-between relative z-10 px-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shadow-blue-100 border border-blue-50">
                                        <Icons.Calendar size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pending Assignments</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignments you haven't finished yet</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => window.location.href = '/assignments'}
                                        className="flex items-center gap-2 px-5 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl font-black text-xs hover:scale-105 hover:bg-gray-50 active:scale-95 transition-all shadow-sm group hover:shadow-md"
                                    >
                                        <Icons.ArrowRight size={14} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                                        <span>View All</span>
                                    </button>
                                    {user && (
                                        <button
                                            onClick={() => setIsAssignmentModalOpen(true)}
                                            className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 group"
                                        >
                                            <Icons.Plus size={14} className="group-hover:rotate-90 transition-transform" />
                                            <span>New Assignment</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Grid container */}
                            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-10 overflow-hidden relative min-h-[200px] flex flex-col justify-center">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                    <Icons.Calendar size={120} className="text-blue-500" />
                                </div>

                                {!user ? (
                                    <div className="flex flex-col items-center text-center py-6 space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="w-20 h-20 bg-blue-50 rounded-[24px] flex items-center justify-center relative">
                                            <div className="absolute inset-0 bg-blue-100/30 rounded-[24px] blur-lg -z-10 animate-pulse" />
                                            <Icons.Lock size={32} className="text-blue-500" />
                                        </div>
                                        <div className="max-w-xs">
                                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Restricted Access</h3>
                                            <p className="text-sm font-medium text-gray-500 leading-relaxed">Sign in to view your pending assignments.</p>
                                        </div>
                                        <a
                                            href={`/login?callbackUrl=${encodeURIComponent('/')}`}
                                            className="h-12 flex items-center px-8 bg-[#0f172a] hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/10"
                                        >
                                            Log In to View
                                        </a>
                                    </div>
                                ) : loadingAssignments ? (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
                                        <p className="text-sm font-bold text-gray-400">Loading assignments...</p>
                                    </div>
                                ) : pendingAssignments.length === 0 ? (
                                    <div className="flex flex-col items-center text-center py-6 space-y-4 relative z-10">
                                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-2">
                                            <Icons.CheckSquare size={28} />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900">All Caught Up!</h3>
                                        <p className="text-sm font-bold text-gray-400">No pending assignments for this semester.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                                        {pendingAssignments.map((assignment) => {
                                            const subject = subjects.find(s => s.id === assignment.subjectId);
                                            return (
                                                <div
                                                    key={assignment.id}
                                                    className="group bg-white border border-gray-100 rounded-[30px] p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                                                <Icons.Calendar size={20} />
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {subject && (
                                                                    <span className="h-8 px-3 bg-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black tracking-wider uppercase flex items-center justify-center">
                                                                        {subject.code}
                                                                    </span>
                                                                )}
                                                                {assignment.platform && (
                                                                    <span className="h-8 px-3 bg-blue-100 text-blue-700 rounded-xl text-[10px] font-black tracking-wider uppercase flex items-center justify-center">
                                                                        {assignment.platform}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-black text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                                                {assignment.title}
                                                            </h4>
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mt-2">
                                                                <Icons.List size={12} className="text-gray-300" />
                                                                <span>{assignment.questions.length} Questions</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="pt-6 mt-4 border-t border-gray-50 flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Due Date</span>
                                                            <span className="text-xs font-black text-gray-800">{assignment.dueDate || 'No due date'}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleCompletion(assignment.id)}
                                                            className="px-4 py-2.5 bg-gray-50 hover:bg-green-50 text-gray-500 hover:text-green-700 border border-transparent hover:border-green-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95"
                                                        >
                                                            <Icons.CheckSquare size={14} />
                                                            <span>Mark Done</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <AnnouncementWidget announcements={announcements} />
                    </>
                ) : (
                    <>
                        {/* Timetable Skeleton */}
                        <div className="h-64 bg-gray-50/50 rounded-[32px] border border-gray-100/50 animate-pulse flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Loading Academic Roadmap...</span>
                        </div>
                        {/* Assignments Skeleton */}
                        <div className="h-64 bg-gray-50/50 rounded-[32px] border border-gray-100/50 animate-pulse flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Loading Pending Assignments...</span>
                        </div>
                        {/* Announcements Skeleton */}
                        <div className="h-64 bg-gray-50/50 rounded-[32px] border border-gray-100/50 animate-pulse flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Loading Announcements...</span>
                        </div>
                    </>
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
