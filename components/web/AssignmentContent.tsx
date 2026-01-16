"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Subject, Assignment } from '@/types';
import { getSubjects, getAssignments, createAssignment, updateAssignment, deleteAssignment } from '@/lib/services/app.service';
import { AssignmentModal } from './AssignmentModal';

export function AssignmentContent() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const fetchedSubjects = await getSubjects();
            setSubjects(fetchedSubjects);
            if (fetchedSubjects.length > 0) {
                setActiveSubjectId(fetchedSubjects[0].id);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const loadAssignments = async () => {
            if (activeSubjectId) {
                setLoading(true);
                const fetched = await getAssignments(activeSubjectId);
                setAssignments(fetched);
                setLoading(false);
            }
        };
        loadAssignments();
    }, [activeSubjectId]);

    const activeSubject = subjects.find(s => s.id === activeSubjectId);

    const handleSaveAssignment = async (data: Partial<Assignment>) => {
        try {
            if (editingAssignment) {
                // Update
                const updated = await updateAssignment({ ...editingAssignment, ...data } as Assignment);
                if (updated.subjectId === activeSubjectId) {
                    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
                } else {
                    // Moved to another subject, remove from current view
                    setAssignments(prev => prev.filter(a => a.id !== updated.id));
                }
            } else {
                // Create
                const newAssignment = await createAssignment({
                    id: crypto.randomUUID(), // Temp ID, or let DB handle it? Supabase usually wants ID if providing, or we omit. Service mapAssignment expects ID. Service createAssignment inserts payload. Let's look at service. Service maps input ID.
                    title: data.title || 'Untitled',
                    description: data.description || '',
                    subjectId: data.subjectId || activeSubjectId!, // Use selected subject!
                    dueDate: data.dueDate || new Date().toISOString().split('T')[0],
                    unitId: data.unitId,
                    platform: data.platform
                } as Assignment);

                if (newAssignment.subjectId === activeSubjectId) {
                    setAssignments(prev => [...prev, newAssignment]);
                }
            }
        } catch (error) {
            console.error("Failed to save assignment:", error);
            // Optionally add toast notification here
        }
        setEditingAssignment(null);
    };

    const handleDeleteAssignment = async (id: string) => {
        try {
            await deleteAssignment(id);
            setAssignments(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete assignment:", error);
        }
    };

    const openEditModal = (assignment: Assignment) => {
        setEditingAssignment(assignment);
        setIsModalOpen(true);
    };

    if (loading && subjects.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Tasks</h2>
                    <p className="text-sm font-bold text-gray-400">
                        {assignments.length} assignments tracked for {activeSubject?.code}
                    </p>
                </div>
                <button
                    onClick={() => { setEditingAssignment(null); setIsModalOpen(true); }}
                    className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Icons.Plus size={18} />
                    <span>New Assignment</span>
                </button>
            </div>

            {/* Subject Switcher - Consistent with Vault */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
                {subjects.map((subject) => {
                    const isActive = activeSubjectId === subject.id;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => setActiveSubjectId(subject.id)}
                            className={cn(
                                "px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1.5 border shadow-sm",
                                isActive
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                            )}
                        >
                            <span className="text-[10px] font-black tracking-widest uppercase">
                                {subject.code}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 bg-white rounded-full shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                    <div
                        key={assignment.id}
                        className="group bg-white border border-gray-100 rounded-[35px] p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden"
                    >

                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors duration-500">
                                <Icons.Calendar size={22} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-black text-gray-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                                    {assignment.title}
                                </h3>
                                <p className="text-sm font-bold text-gray-400 line-clamp-2">
                                    {assignment.description}
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Due Date</span>
                                    <span className="text-sm font-black text-gray-900">{assignment.dueDate}</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(assignment)}
                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                                    >
                                        <Icons.Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                    >
                                        <Icons.Delete size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add Card */}
                <button
                    onClick={() => { setEditingAssignment(null); setIsModalOpen(true); }}
                    className="group border-2 border-dashed border-gray-100 rounded-[35px] p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-200 hover:bg-blue-50/10 transition-all duration-500 min-h-[280px]"
                >
                    <div className="w-16 h-16 bg-gray-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center text-gray-300 group-hover:text-blue-600 transition-all duration-500 group-hover:scale-110">
                        <Icons.Plus size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600">New Assignment</p>
                        <p className="text-xs font-bold text-gray-300 mt-1">Add to {activeSubject?.code}</p>
                    </div>
                </button>
            </div>

            <AssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAssignment}
                assignment={editingAssignment}
                subjects={subjects}
            />
        </div>
    );
}
