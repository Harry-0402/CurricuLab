"use client"

import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Agent } from './MindGridContent';

interface AddAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (agent: Omit<Agent, 'id'>, id?: string) => void;
    initialData?: Agent | null;
}

export default function AddAgentModal({ isOpen, onClose, onSave, initialData }: AddAgentModalProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        url: initialData?.url || '',
        platform: initialData?.platform || 'other' as Agent['platform'],
        category: initialData?.category || 'General' as Agent['category']
    });

    // Reset or populate form when modal opens/closes or initialData changes
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: initialData?.name || '',
                description: initialData?.description || '',
                url: initialData?.url || '',
                platform: initialData?.platform || 'other',
                category: initialData?.category || 'General'
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedUrl = formData.url.trim();
        if (!formData.name || !trimmedUrl) return;
        onSave({ ...formData, url: trimmedUrl }, initialData?.id);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                {initialData ? 'Update AI Unit' : 'Register AI Unit'}
                            </h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {initialData ? 'Modifying Intelligence Protocol' : 'Expanding MindGrid Intelligence'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-12 h-12 rounded-2xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
                        >
                            <Icons.X size={24} />
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Designation (Name)</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Code Prophet"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-semibold transition-all"
                            />
                        </div>

                        {/* URL */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Frequency (URL)</label>
                            <input
                                required
                                type="text"
                                value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://chatgpt.com/g/..."
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-semibold transition-all"
                            />
                        </div>

                        {/* Platform & Category Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Core Engine</label>
                                <select
                                    value={formData.platform}
                                    onChange={e => setFormData({ ...formData, platform: e.target.value as any })}
                                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-semibold appearance-none cursor-pointer"
                                >
                                    <option value="openai">OpenAI (GPT)</option>
                                    <option value="google">Google (Gem)</option>
                                    <option value="other">Other Interface</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Field</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-semibold appearance-none cursor-pointer"
                                >
                                    <option value="General">General</option>
                                    <option value="Writing">Writing</option>
                                    <option value="Productivity">Productivity</option>
                                    <option value="Research & Analysis">Research & Analysis</option>
                                    <option value="Education">Education</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="DALL·E">DALL·E</option>
                                    <option value="Programming">Programming</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Intelligence Overview</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the unit's specialized capabilities..."
                                className="w-full h-32 px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-semibold resize-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
                        >
                            {initialData ? <Icons.Save size={18} /> : <Icons.Plus size={18} />}
                            {initialData ? 'Save Modifications' : 'Register Unit to Grid'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
