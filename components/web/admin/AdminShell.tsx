'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { ProgramsTab } from './ProgramsTab';
import { SemestersTab } from './SemestersTab';
import { SubjectsAdminTab } from './SubjectsAdminTab';
import { StudentsTab } from './StudentsTab';
import { TimetableAdminTab } from './TimetableAdminTab';
import { cn } from '@/lib/utils';

type AdminTab = 'programs' | 'semesters' | 'subjects' | 'students' | 'timetable';

const tabs: { id: AdminTab; label: string; icon: any; description: string }[] = [
    { id: 'programs', label: 'Programs', icon: Icons.GraduationCap, description: 'Manage degree programs' },
    { id: 'semesters', label: 'Semesters', icon: Icons.BookOpen, description: 'Manage semesters per program' },
    { id: 'subjects', label: 'Subjects', icon: Icons.Subjects, description: 'Add/edit subjects per semester' },
    { id: 'students', label: 'Students & Enrollment', icon: Icons.Users, description: 'Manage student access and class enrollment' },
    { id: 'timetable', label: 'Timetable', icon: Icons.Clock, description: 'Manage class schedules' },
];

export function AdminShell() {
    const [activeTab, setActiveTab] = useState<AdminTab>('programs');

    const renderTab = () => {
        switch (activeTab) {
            case 'programs': return <ProgramsTab />;
            case 'semesters': return <SemestersTab />;
            case 'subjects': return <SubjectsAdminTab />;
            case 'students': return <StudentsTab />;
            case 'timetable': return <TimetableAdminTab />;
        }
    };

    return (
        <div className="h-screen bg-[#fafbfc] flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen overflow-y-auto">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <Icons.Settings size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">Admin Panel</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CurricuLab</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <tab.icon size={18} className={isActive ? "text-indigo-600" : "text-gray-400"} />
                                <span className="text-sm font-semibold">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Back link */}
                <div className="px-3 py-4 border-t border-gray-100">
                    <a
                        href="/"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                    >
                        <Icons.ArrowLeft size={16} />
                        Back to App
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        {tabs.filter(t => t.id === activeTab).map(tab => (
                            <div key={tab.id} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                                    <tab.icon size={22} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900">{tab.label}</h1>
                                    <p className="text-gray-500 text-sm">{tab.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {renderTab()}
                </div>
            </main>
        </div>
    );
}
