"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { CareerService, Application } from '@/lib/services/career-service';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_COLS = [
    { id: 'Applied', label: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { id: 'Interviewing', label: 'Interviewing', color: 'bg-purple-50 text-purple-700 border-purple-100' },
    { id: 'Offer', label: 'Offer', color: 'bg-green-50 text-green-700 border-green-100' },
    { id: 'Rejected', label: 'Rejected', color: 'bg-gray-50 text-gray-500 border-gray-100' },
    { id: 'Wishlist', label: 'Wishlist', color: 'bg-yellow-50 text-yellow-700 border-yellow-100' }
];

export function InterviewLineup() {
    const [apps, setApps] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newApp, setNewApp] = useState({ company: '', role: '', status: 'Applied', notes: '' });

    const loadApps = async () => {
        setIsLoading(true);
        const data = await CareerService.getAll();
        setApps(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadApps();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await CareerService.create(newApp as any);
            toast.success('Application added!');
            setIsAddOpen(false);
            setNewApp({ company: '', role: '', status: 'Applied', notes: '' });
            loadApps();
        } catch (err) {
            toast.error('Failed to add application');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this application?')) return;
        await CareerService.delete(id);
        loadApps();
    };

    const handleStatusMove = async (id: string, newStatus: string) => {
        await CareerService.update(id, { status: newStatus as any });
        loadApps();
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-2xl font-black text-gray-900">Your Applications</h2>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
                >
                    <Icons.Plus size={16} />
                    <span>Track Application</span>
                </button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto md:overflow-x-auto pb-4">
                <div className="flex flex-col md:flex-row gap-4 md:min-w-[1000px] h-full">
                    {STATUS_COLS.map(col => {
                        const colApps = apps.filter(a => a.status === col.id);
                        return (
                            <div key={col.id} className="flex-1 flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100 h-auto md:h-full md:max-h-full min-h-[200px]">
                                <div className={`p-4 border-b border-gray-100 font-bold flex justify-between items-center ${col.color.split(' ')[1]}`}>
                                    <span>{col.label}</span>
                                    <span className="bg-white px-2 py-0.5 rounded-md text-xs border border-gray-100 shadow-sm text-gray-600">{colApps.length}</span>
                                </div>
                                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                    {colApps.map(app => (
                                        <div key={app.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{app.company}</h3>
                                                <button onClick={() => handleDelete(app.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Icons.Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{app.role}</p>
                                            {app.notes && (
                                                <div className="mb-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                                    <p className="text-xs font-medium text-gray-600 break-words whitespace-pre-line line-clamp-6" title={app.notes}>
                                                        {app.notes}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex justify-between gap-2 mt-2">
                                                {col.id !== 'Rejected' && (
                                                    <button
                                                        onClick={() => handleStatusMove(app.id, 'Rejected')}
                                                        className="flex items-center gap-1 px-2 py-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors text-xs font-medium"
                                                        title="Mark Rejected"
                                                    >
                                                        <Icons.X size={12} />
                                                        <span>Reject</span>
                                                    </button>
                                                )}
                                                {col.id !== 'Offer' && (
                                                    <button
                                                        onClick={() => {
                                                            const next = STATUS_COLS[(STATUS_COLS.findIndex(c => c.id === col.id) + 1) % STATUS_COLS.length].id;
                                                            handleStatusMove(app.id, next);
                                                        }}
                                                        className="flex items-center gap-1 px-2 py-1.5 hover:bg-green-50 text-gray-400 hover:text-green-500 rounded-lg transition-colors text-xs font-medium ml-auto"
                                                        title="Move Next"
                                                    >
                                                        <span>Next</span>
                                                        <Icons.ArrowRight size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {colApps.length === 0 && (
                                        <div className="text-center py-8 text-gray-300 text-xs font-medium">Empty</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-xl font-black mb-4">Track New Application</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input
                                required placeholder="Company Name"
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none border-2"
                                value={newApp.company} onChange={e => setNewApp({ ...newApp, company: e.target.value })}
                            />
                            <input
                                required placeholder="Role Title"
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none border-2"
                                value={newApp.role} onChange={e => setNewApp({ ...newApp, role: e.target.value })}
                            />
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none border-2"
                                value={newApp.status} onChange={e => setNewApp({ ...newApp, status: e.target.value })}
                            >
                                {STATUS_COLS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                            <textarea
                                placeholder="Notes (optional)"
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none border-2 h-24 resize-none"
                                value={newApp.notes} onChange={e => setNewApp({ ...newApp, notes: e.target.value })}
                            />
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
