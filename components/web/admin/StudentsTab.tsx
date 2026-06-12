'use client';

import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import {
    getAuthorizedUsers,
    addAuthorizedUser,
    removeAuthorizedUser,
    updateUserEnrollment,
} from '@/lib/services/enrollment-service';
import { getSemesters } from '@/lib/services/semester-service';
import { supabase } from '@/utils/supabase/client';
import { Semester } from '@/types';

interface AuthorizedUser {
    email: string;
    userId: string | null;
    fullName: string | null;
    role: string | null;
    semesterId: string | null;
    semesterName: string | null;
}

function getInitials(name: string | null, email: string): string {
    if (name && name.trim()) {
        const parts = name.trim().split(' ');
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
}

const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-violet-100 text-violet-700',
    student: 'bg-blue-100 text-blue-700',
};

export function StudentsTab() {
    const [students, setStudents] = useState<AuthorizedUser[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    async function loadAll() {
        setIsLoading(true);
        const [users, sems] = await Promise.all([getAuthorizedUsers(), getSemesters()]);
        setStudents(users);
        setSemesters(sems);
        setIsLoading(false);
    }

    useEffect(() => {
        loadAll();

        const channel = supabase.channel('realtime_students')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                loadAll();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'authorized_users' }, () => {
                loadAll();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function handleChangeEnrollment(userId: string, semesterId: string) {
        setUpdatingId(userId);
        const ok = await updateUserEnrollment(userId, semesterId);
        if (ok) {
            setStudents(prev => prev.map(s =>
                s.userId === userId
                    ? { ...s, semesterId, semesterName: semesters.find(sem => sem.id === semesterId)?.name ?? null }
                    : s
            ));
        } else {
            alert('Failed to update enrollment.');
        }
        setUpdatingId(null);
    }

    async function handleRemove(email: string) {
        if (!confirm(`Remove "${email}" from authorized users? They will lose access.`)) return;
        const ok = await removeAuthorizedUser(email);
        if (ok) {
            setStudents(prev => prev.filter(s => s.email !== email));
        } else {
            alert('Failed to remove user.');
        }
    }

    async function handleMakeAdmin(userId: string) {
        if (!confirm('Promote this user to admin? They will have full admin access.')) return;
        const { error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
        if (error) {
            console.error(error);
            alert('Failed to update role.');
        } else {
            setStudents(prev => prev.map(s => s.userId === userId ? { ...s, role: 'admin' } : s));
        }
    }

    async function handleAddStudent() {
        if (!newEmail.trim()) { setAddError('Email is required.'); return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail.trim())) { setAddError('Please enter a valid email address.'); return; }
        if (students.some(s => s.email.toLowerCase() === newEmail.trim().toLowerCase())) {
            setAddError('This email is already authorized.');
            return;
        }

        setIsAdding(true);
        setAddError(null);
        const ok = await addAuthorizedUser(newEmail.trim());
        if (ok) {
            setStudents(prev => [
                ...prev,
                { email: newEmail.trim().toLowerCase(), userId: null, fullName: null, role: null, semesterId: null, semesterName: null }
            ]);
            setNewEmail('');
            setShowAddModal(false);
        } else {
            setAddError('Failed to add user. They may already be in the list.');
        }
        setIsAdding(false);
    }

    const filtered = students.filter(s => {
        const q = searchQuery.toLowerCase();
        return (
            s.email.toLowerCase().includes(q) ||
            (s.fullName?.toLowerCase().includes(q) ?? false)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Icons.Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by email or name…"
                            className="bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>
                    {!isLoading && (
                        <p className="text-sm text-gray-400">{filtered.length} of {students.length} students</p>
                    )}
                </div>
                <button
                    onClick={() => { setNewEmail(''); setAddError(null); setShowAddModal(true); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    <Icons.Plus size={16} />
                    Add Student
                </button>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                                <div className="w-9 h-9 rounded-full bg-gray-100" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 bg-gray-100 rounded w-1/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                                </div>
                                <div className="h-8 w-32 bg-gray-100 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Student Table */}
            {!isLoading && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="p-16 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <Icons.Users size={32} className="text-indigo-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-gray-700 font-semibold">
                                    {searchQuery ? 'No students match your search' : 'No students yet'}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {searchQuery ? 'Try a different query.' : 'Add student emails to grant access.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {/* Table Header */}
                            <div className="px-6 py-3 grid grid-cols-12 gap-4 bg-gray-50/70">
                                <div className="col-span-4 text-xs font-black text-gray-400 uppercase tracking-wider">Student</div>
                                <div className="col-span-2 text-xs font-black text-gray-400 uppercase tracking-wider">Role</div>
                                <div className="col-span-3 text-xs font-black text-gray-400 uppercase tracking-wider">Enrollment</div>
                                <div className="col-span-3 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Actions</div>
                            </div>

                            {filtered.map((student, idx) => (
                                <div
                                    key={student.email}
                                    className={cn(
                                        "px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-indigo-50/30 transition-colors",
                                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/20"
                                    )}
                                >
                                    {/* Student Info */}
                                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-black text-indigo-700">
                                                {getInitials(student.fullName, student.email)}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            {student.fullName ? (
                                                <p className="text-sm font-semibold text-gray-900 truncate">{student.fullName}</p>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">Not signed in yet</p>
                                            )}
                                            <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                                                <Icons.Mail size={10} />
                                                {student.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="col-span-2">
                                        <span className={cn(
                                            "text-xs font-bold px-2.5 py-1 rounded-full",
                                            student.role
                                                ? (ROLE_COLORS[student.role] ?? 'bg-gray-100 text-gray-500')
                                                : 'bg-gray-100 text-gray-400 italic'
                                        )}>
                                            {student.role ?? 'pending'}
                                        </span>
                                    </div>

                                    {/* Enrollment */}
                                    <div className="col-span-3">
                                        {student.userId ? (
                                            <div className="relative">
                                                <select
                                                    value={student.semesterId ?? ''}
                                                    onChange={e => handleChangeEnrollment(student.userId!, e.target.value)}
                                                    disabled={updatingId === student.userId}
                                                    className="appearance-none w-full bg-gray-50 border border-gray-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="">— Not enrolled —</option>
                                                    {semesters.map(s => (
                                                        <option key={s.id} value={s.id}>
                                                            {s.shortName}{s.academicYear ? ` (${s.academicYear})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Icons.ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-300 italic">Not signed in yet</span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-3 flex items-center justify-end gap-2">
                                        {student.userId && student.role !== 'admin' && (
                                            <button
                                                onClick={() => handleMakeAdmin(student.userId!)}
                                                className="flex items-center gap-1 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-2.5 py-1.5 rounded-lg transition-colors"
                                                title="Promote to Admin"
                                            >
                                                <Icons.Shield size={12} />
                                                Admin
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemove(student.email)}
                                            className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
                                            title="Remove access"
                                        >
                                            <Icons.Trash2 size={12} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                            <h2 className="text-lg font-black text-gray-900">Add Student</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                                <Icons.X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <p className="text-sm text-gray-500">
                                Add a student's email to grant them access to CurricuLab. They will be able to sign in once added.
                            </p>
                            {addError && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100">
                                    <Icons.AlertTriangle size={15} className="flex-shrink-0" />
                                    {addError}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                                <div className="relative">
                                    <Icons.Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleAddStudent(); }}
                                        placeholder="student@example.com"
                                        className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStudent}
                                disabled={isAdding}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors",
                                    isAdding ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                                )}
                            >
                                {isAdding ? <Icons.Loader2 size={15} className="animate-spin" /> : <Icons.User size={15} />}
                                Grant Access
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
