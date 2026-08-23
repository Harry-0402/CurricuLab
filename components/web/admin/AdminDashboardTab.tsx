import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { getAuthorizedUsers } from '@/lib/services/enrollment-service';
import { getSemesters } from '@/lib/services/semester-service';

interface AdminDashboardTabProps {
    onNavigate: (tab: string, action?: string) => void;
}

export function AdminDashboardTab({ onNavigate }: AdminDashboardTabProps) {
    const [stats, setStats] = useState({
        students: 0,
        semesters: 0,
        loading: true
    });

    useEffect(() => {
        async function loadStats() {
            try {
                const [users, sems] = await Promise.all([
                    getAuthorizedUsers(),
                    getSemesters()
                ]);
                setStats({
                    students: users.filter((u: any) => u.role === 'student').length,
                    semesters: sems.length,
                    loading: false
                });
            } catch (error) {
                console.error("Failed to load stats", error);
                setStats(s => ({ ...s, loading: false }));
            }
        }
        loadStats();
    }, []);

    const quickActions = [
        {
            title: 'Add Student',
            description: 'Authorize a new student email',
            icon: Icons.Users,
            color: 'bg-blue-50 text-blue-600 border-blue-100',
            action: () => onNavigate('students', 'add')
        },
        {
            title: 'Add Timetable',
            description: 'Schedule a new class session',
            icon: Icons.Clock,
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            action: () => onNavigate('timetable', 'add')
        },
        {
            title: 'Manage Subjects',
            description: 'Update syllabus and materials',
            icon: Icons.BookOpen,
            color: 'bg-purple-50 text-purple-600 border-purple-100',
            action: () => onNavigate('subjects')
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <Icons.Users size={20} />
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                        {stats.loading ? '-' : stats.students}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Students</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-3">
                        <Icons.GraduationCap size={20} />
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                        {stats.loading ? '-' : stats.semesters}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Semesters</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-black text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((item, i) => (
                        <button
                            key={i}
                            onClick={item.action}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 text-left active:scale-[0.98]"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${item.color}`}>
                                <item.icon size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{item.title}</h4>
                                <p className="text-sm text-gray-500 mt-1 leading-snug">{item.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
