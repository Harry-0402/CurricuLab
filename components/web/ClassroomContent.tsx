"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

// Custom Components
import { GoogleClassroomView } from './classroom/GoogleClassroomView';
import CourseCard from './classroom/CourseCard';

export function ClassroomContent() {
    // State
    const [isDriveConnected, setIsDriveConnected] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [isCoursesLoading, setIsCoursesLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Initial Load - User & Drive Status
    useEffect(() => {
        const checkAuthAndDrive = async () => {
            setIsLoading(true);
            try {
                // Check User Session first
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;
                setUser(session.user);

                // Check Drive Connection
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('drive_connected')) {
                    setIsDriveConnected(true);
                    window.history.replaceState({}, '', window.location.pathname);
                    toast.success('Google Classroom connected successfully!');
                } else if (urlParams.get('error')) {
                    const errorCode = urlParams.get('error');
                    let message = 'Failed to connect Google Classroom.';

                    if (errorCode === 'token_storage_failed') message = 'Securely storing your connection failed. Please try again.';
                    if (errorCode === 'oauth_failed') message = 'Google authorization failed. Ensure you granted all permissions.';
                    if (errorCode === 'unauthorized') message = 'You must be signed in to connect Google Classroom.';

                    toast.error(message);
                    window.history.replaceState({}, '', window.location.pathname);
                } else {
                    const res = await fetch('/api/auth/google/status');
                    if (res.ok) {
                        const data = await res.json();
                        setIsDriveConnected(data.connected);
                    } else {
                        setIsDriveConnected(false);
                    }
                }
            } catch (error) {
                console.error('Error checking drive status:', error);
                setIsDriveConnected(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthAndDrive();
    }, []);

    // Load courses when connected
    useEffect(() => {
        if (isDriveConnected) {
            loadCourses();
        }
    }, [isDriveConnected]);

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

    return (
        <WebAppShell>
            <div className="max-w-[1400px] mx-auto p-4 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-2">
                        <h1 className="text-[10px] font-black text-blue-600 mb-1 uppercase tracking-[0.2em]">
                            {selectedCourse ? 'Classroom' : 'Resources'}
                        </h1>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                            {selectedCourse ? selectedCourse.name : 'Classroom'}
                        </h1>
                        {!selectedCourse && (
                            <p className="text-gray-400 font-medium max-w-xl">
                                Access your synced Google Classroom courses, assignments, and study materials in one place.
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {isDriveConnected && selectedCourse && (
                            <>
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    <Icons.ArrowLeft size={16} />
                                    <span>Back to All Classes</span>
                                </button>

                                <a
                                    href={selectedCourse.alternateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap"
                                >
                                    <Icons.ExternalLink size={16} />
                                    <span>Open in Classroom</span>
                                </a>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                {isLoading || isCoursesLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-gray-500">Loading Classroom...</p>
                        </div>
                    </div>
                ) : (
                    <div className="pb-20">
                        {!selectedCourse ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                                {courses.map(course => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        onSelect={setSelectedCourse}
                                    />
                                ))}
                            </div>
                        ) : (
                            <GoogleClassroomView
                                isDriveConnected={isDriveConnected}
                                connectGoogleDrive={connectGoogleDrive}
                                selectedCourse={selectedCourse}
                            />
                        )}
                    </div>
                )}
            </div>
        </WebAppShell>
    );
}
