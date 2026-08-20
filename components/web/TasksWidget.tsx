"use client"

import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { Assignment } from '@/types';
import { cn } from '@/lib/utils';

interface TasksWidgetProps {
    assignments: Assignment[];
    completedAssignments: Set<string>;
    onToggleCompletion: (id: string) => void;
    onAddClick?: () => void;
}

export function TasksWidget({ assignments, completedAssignments, onToggleCompletion, onAddClick }: TasksWidgetProps) {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'overdue' | 'completed'>('upcoming');

    const today = new Date().toISOString().split('T')[0];
    const upcoming = assignments.filter(a => !completedAssignments.has(a.id) && (a.dueDate || '9999-12-31') >= today);
    const overdue = assignments.filter(a => !completedAssignments.has(a.id) && (a.dueDate || '9999-12-31') < today);
    const completed = assignments.filter(a => completedAssignments.has(a.id));

    // Auto-switch to overdue if there are no upcoming tasks
    React.useEffect(() => {
        if (upcoming.length === 0 && overdue.length > 0 && activeTab === 'upcoming') {
            setActiveTab('overdue');
        }
    }, [upcoming.length, overdue.length]);

    const displayed = activeTab === 'upcoming' ? upcoming : activeTab === 'overdue' ? overdue : completed;

    const getPriority = (a: Assignment) => {
        // mock priority based on title length just to have something visual
        if (a.title.length > 30) return { label: 'High', color: 'text-rose-600 bg-rose-50' };
        if (a.title.length > 15) return { label: 'Medium', color: 'text-orange-600 bg-orange-50' };
        return { label: 'Low', color: 'text-emerald-600 bg-emerald-50' };
    };

    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Tasks & Deadlines</h3>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700" onClick={() => window.location.href = '/assignments'}>View All</button>
            </div>

            <div className="flex bg-gray-50/80 p-1 rounded-xl mb-6">
                {(['upcoming', 'overdue', 'completed'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all",
                            activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {tab} {tab === 'upcoming' ? `(${upcoming.length})` : tab === 'overdue' ? `(${overdue.length})` : ''}
                    </button>
                ))}
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                {displayed.length === 0 ? (
                    <div className="text-center py-10 flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <Icons.CheckCircle size={24} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">
                            {activeTab === 'upcoming' 
                                ? (overdue.length > 0 ? `No upcoming tasks. You have ${overdue.length} overdue tasks.` : "You're all caught up!") 
                                : activeTab === 'overdue' ? "No overdue tasks! Great job." 
                                : "No completed tasks yet."}
                        </p>
                    </div>
                ) : (
                    displayed.map(task => {
                        const priority = getPriority(task);
                        const isDone = completedAssignments.has(task.id);
                        
                        return (
                            <div key={task.id} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                <button
                                    onClick={() => onToggleCompletion(task.id)}
                                    className="mt-1 text-gray-300 hover:text-indigo-500 transition-colors shrink-0"
                                >
                                    {isDone ? <Icons.CheckSquare size={20} className="text-green-500" /> : <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-indigo-400" />}
                                </button>
                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => window.location.href = `/assignments?assignmentId=${task.id}`}>
                                    <h4 className={cn("text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors", isDone && "line-through opacity-50")}>
                                        {task.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        Subject • Due {task.dueDate || 'No Date'}
                                    </p>
                                </div>
                                <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold shrink-0", priority.color)}>
                                    {priority.label}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
            
            {onAddClick && (
                 <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <button 
                        onClick={onAddClick}
                        className="text-xs font-bold text-gray-500 hover:text-indigo-600 flex items-center justify-center gap-1 w-full"
                    >
                        <Icons.Plus size={14} /> Add New Task
                    </button>
                </div>
            )}
        </div>
    );
}
