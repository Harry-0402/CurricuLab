"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

// Custom Components
import { GoogleClassroomView } from './classroom/GoogleClassroomView';
import CourseCard from './classroom/CourseCard';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { SubjectService } from '@/lib/data/subject-service';
import { Subject } from '@/types';

export function ClassroomContent() {
    // State
    const [isDriveConnected, setIsDriveConnected] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [isCoursesLoading, setIsCoursesLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            const fetched = await SubjectService.getAll();
            setSubjects(fetched);
        };
        fetchSubjects();
    }, []);

    // Initial Load - Parallel Fetching
    useEffect(() => {
        const initializeClassroom = async () => {
            setIsLoading(true);
            try {
                // 1. Check User Session
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    setIsLoading(false);
                    return;
                }
                setUser(session.user);

                // Check URL params for redirect handling
                const urlParams = new URLSearchParams(window.location.search);
                const isRedirect = urlParams.get('drive_connected') || urlParams.get('error');

                if (isRedirect) {
                    // Handle Validation Redirects synchronously
                    if (urlParams.get('drive_connected')) {
                        setIsDriveConnected(true);
                        toast.success('Google Classroom connected successfully!');
                        // Fetch courses immediately after successful connect
                        loadCourses();
                    } else if (urlParams.get('error')) {
                        setIsDriveConnected(false);
                        const errorCode = urlParams.get('error');
                        let message = 'Failed to connect Google Classroom.';
                        if (errorCode === 'token_storage_failed') message = 'Securely storing your connection failed. Please try again.';
                        if (errorCode === 'oauth_failed') message = 'Google authorization failed. Ensure you granted all permissions.';
                        if (errorCode === 'unauthorized') message = 'You must be signed in to connect Google Classroom.';
                        toast.error(message);
                    }
                    window.history.replaceState({}, '', window.location.pathname);
                    setIsLoading(false);
                } else {
                    // 2. Parallel Fetch: Status & Courses
                    const [statusRes, coursesRes] = await Promise.all([
                        fetch('/api/auth/google/status'),
                        fetch('/api/classroom/google/courses')
                    ]);

                    // Handle Status
                    if (statusRes.ok) {
                        const statusData = await statusRes.json();
                        setIsDriveConnected(statusData.connected);
                    } else {
                        setIsDriveConnected(false);
                    }

                    // Handle Courses
                    if (coursesRes.ok) {
                        const coursesData = await coursesRes.json();
                        if (coursesData.courses && coursesData.courses.length > 0) {
                            setCourses(coursesData.courses);
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing classroom:', error);
                setIsDriveConnected(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializeClassroom();
    }, []);

    // Helper to reload courses manually
    const loadCourses = async () => {
        setIsCoursesLoading(true);
        try {
            const res = await fetch('/api/classroom/google/courses');
            const data = await res.json();
            if (data.courses && data.courses.length > 0) {
                setCourses(data.courses);
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setIsCoursesLoading(false);
        }
    };

    const connectGoogleDrive = () => {
        window.location.href = '/api/auth/google';
    };

    const handleResetPermission = async () => {
        setIsResetting(true);
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/google/reset', { method: 'POST' });
            if (res.ok) {
                setIsDriveConnected(false);
                setCourses([]);
                setSelectedCourse(null);
                toast.success('Connection reset successfully');
            } else {
                toast.error('Failed to reset connection');
            }
        } catch (error) {
            console.error('Reset error:', error);
            toast.error('An error occurred during reset');
        } finally {
            setIsLoading(false);
            setIsResetting(false);
            setShowResetConfirm(false);
        }
    };

    return (
        <WebAppShell>
            <div className="max-w-[1400px] mx-auto p-4 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 md:gap-4 mb-6 md:mb-12">
                    <div className="min-w-0">
                        <h1 className="text-[10px] font-black text-blue-600 mb-0.5 uppercase tracking-[0.2em] hidden sm:block">
                            {selectedCourse ? 'Classroom' : 'Resources'}
                        </h1>
                        <div className="flex items-center gap-3">
                            <h1 className={cn(
                                "font-black text-gray-900 tracking-tight truncate",
                                selectedCourse ? "text-xl md:text-3xl" : "text-3xl md:text-5xl"
                            )}>
                                {selectedCourse ? selectedCourse.name : 'Classroom'}
                            </h1>
                        </div>
                        {!selectedCourse && (
                            <div className="space-y-2 mt-1">
                                <p className="text-gray-400 font-medium max-w-xl text-sm hidden sm:block">
                                    Access your synced Google Classroom courses, assignments, and study materials in one place.
                                </p>
                                <div className="text-[11px] font-medium text-purple-600 bg-purple-50/50 border border-purple-100/50 p-3 rounded-2xl flex items-start gap-2 leading-relaxed max-w-xl hidden sm:flex">
                                    <Icons.Info size={14} className="shrink-0 mt-0.5 text-purple-500" />
                                    <span>
                                        <strong>Note:</strong> These are all of your enrolled Google Classrooms, displaying your coursework and synced materials irrespective of the semester you are currently browsing.
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        {!selectedCourse && isDriveConnected && (
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-red-50 text-red-600 rounded-xl text-xs md:text-sm font-bold hover:bg-red-100 transition-all active:scale-95 shadow-sm border border-red-100 shrink-0"
                            >
                                <Icons.RotateCcw size={16} />
                                <span className="hidden sm:inline">Reset Connection</span>
                                <span className="sm:hidden">Reset</span>
                            </button>
                        )}

                        {isDriveConnected && selectedCourse && (
                            <>
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs md:text-sm font-bold hover:bg-gray-200 transition-all active:scale-95 shrink-0"
                                >
                                    <Icons.ArrowLeft size={14} />
                                    <span className="hidden sm:inline">Back to All Classes</span>
                                    <span className="sm:hidden">Back</span>
                                </button>

                                <a
                                    href={selectedCourse.alternateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-3 py-2 md:px-6 md:py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs md:text-sm font-bold hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap shrink-0"
                                >
                                    <Icons.ExternalLink size={14} />
                                    <span className="hidden sm:inline">Open in Classroom</span>
                                    <span className="sm:hidden">Open</span>
                                </a>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile-only Note */}
                {!selectedCourse && (
                    <div className="block sm:hidden text-[11px] font-medium text-purple-600 bg-purple-50/50 border border-purple-100/50 p-3 rounded-2xl flex items-start gap-2 leading-relaxed mb-4">
                        <Icons.Info size={13} className="shrink-0 mt-0.5 text-purple-500" />
                        <span>These are all of your enrolled Google Classrooms, irrespective of the semester.</span>
                    </div>
                )}

                {/* Main Content Area */}
                {isLoading || isCoursesLoading ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-gray-500 font-bold uppercase tracking-widest">Loading Classroom...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <ConfirmationModal
                            isOpen={showResetConfirm}
                            onClose={() => setShowResetConfirm(false)}
                            onConfirm={handleResetPermission}
                            title="Disconnect Classroom?"
                            description="This will clear your current connection with Google Classroom. You'll need to re-authenticate to access your courses and materials."
                            confirmText="Disconnect"
                            variant="danger"
                            isLoading={isResetting}
                            icon="RotateCcw"
                        />
                        <div className="pb-20">
                            {!selectedCourse ? (
                                !isDriveConnected ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                            <Icons.Google size={40} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-3">Connect Google Classroom</h3>
                                        <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">
                                            Sync your Google Classroom to access all your courses, assignments, and study materials in one place.
                                        </p>
                                        <button
                                            onClick={connectGoogleDrive}
                                            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                                        >
                                            <Icons.Link size={20} />
                                            <span>Connect Google Account</span>
                                        </button>
                                    </div>
                                ) : courses.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                            <Icons.Subjects size={40} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-3">No Courses Found</h3>
                                        <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">
                                            We couldn't find any active courses in your Google Classroom. Make sure you're enrolled in at least one class.
                                        </p>
                                        <button
                                            onClick={loadCourses}
                                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                        >
                                            <Icons.RotateCcw size={18} />
                                            <span>Refresh Courses</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                                        {courses.map(course => {
                                            const normalizeStr = (str: string): string => {
                                                return str
                                                    .toLowerCase()
                                                    .replace(/&/g, 'and')
                                                    .replace(/[^a-z0-9]/g, '')
                                                    .replace(/(.)\1+/g, '$1');
                                            };
                                            const courseNameNormalized = normalizeStr(course.name);
                                            const subject = subjects.find(s => {
                                                if (s.gcrKeyword) {
                                                    const keywordNormalized = normalizeStr(s.gcrKeyword);
                                                    if (courseNameNormalized.includes(keywordNormalized) || keywordNormalized.includes(courseNameNormalized)) return true;
                                                }
                                                return false;
                                            });

                                            return (
                                                <CourseCard
                                                    key={course.id}
                                                    course={course}
                                                    matchedSubjectCode={subject?.code}
                                                    onSelect={setSelectedCourse}
                                                />
                                            );
                                        })}
                                    </div>
                                )
                            ) : (
                                <GoogleClassroomView
                                    isDriveConnected={isDriveConnected}
                                    connectGoogleDrive={connectGoogleDrive}
                                    selectedCourse={selectedCourse}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </WebAppShell>
    );
}
