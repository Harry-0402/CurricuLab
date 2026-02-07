"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

// Custom Components
import { GoogleClassroomView } from './classroom/GoogleClassroomView';

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
                setSelectedCourse(data.courses[0]);
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
            <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-[1800px] mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between shrink-0 mb-8">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Resources</h1>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">Classroom</p>
                    </div>

                    {isDriveConnected && courses.length > 0 && (
                        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                            <div className="relative">
                                <select
                                    value={selectedCourse?.id || ''}
                                    onChange={(e) => {
                                        const course = courses.find(c => c.id === e.target.value);
                                        setSelectedCourse(course);
                                    }}
                                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[240px] max-w-[400px] truncate"
                                >
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Icons.ChevronDown size={16} />
                                </div>
                            </div>

                            {selectedCourse && (
                                <a
                                    href={selectedCourse.alternateLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap"
                                >
                                    <Icons.ExternalLink size={16} />
                                    <span>Open in Classroom</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-gray-500">Loading Classroom...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden">
                        <GoogleClassroomView
                            isDriveConnected={isDriveConnected}
                            connectGoogleDrive={connectGoogleDrive}
                            selectedCourse={selectedCourse}
                        />
                    </div>
                )}
            </div>
        </WebAppShell>
    );
}
