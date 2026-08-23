"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Icons } from '@/components/shared/Icons';
import { toast } from 'sonner';
import { useSemester } from '@/components/providers/SemesterProvider';
import { SubjectService } from '@/lib/data/subject-service';

interface WhatsAppGroup {
    id: string;
    name: string;
    link: string;
    description: string;
    category: string;
    icon_url?: string;
}

export function WhatsAppGroups() {
    const { activeSemesterId } = useSemester();
    const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: '',
        link: '',
        description: '',
        category: 'General',
        icon_url: ''
    });

    const [categories, setCategories] = useState<string[]>(['General']);

    useEffect(() => {
        if (activeSemesterId) {
            fetchGroups();
        }
    }, [activeSemesterId]);

    useEffect(() => {
        const loadDynamicCategories = async () => {
            if (activeSemesterId) {
                const subjects = await SubjectService.getAll(activeSemesterId);
                const codes = subjects.map(s => s.code).filter(Boolean);
                setCategories(['General', ...codes]);
            }
        };
        loadDynamicCategories();
    }, [activeSemesterId]);

    const fetchGroups = async () => {
        if (!activeSemesterId) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('whatsapp_groups')
                .select('*')
                .eq('semester_id', activeSemesterId)
                .order('name');
            if (error) throw error;
            setGroups(data || []);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddGroup = async () => {
        if (!newGroup.name.trim() || !newGroup.link.trim()) {
            toast.error('Please fill in group name and link');
            return;
        }

        try {
            const { error } = await supabase
                .from('whatsapp_groups')
                .insert({
                    name: newGroup.name,
                    link: newGroup.link,
                    description: newGroup.description,
                    category: newGroup.category,
                    icon_url: newGroup.icon_url || null,
                    semester_id: activeSemesterId
                });

            if (error) throw error;

            toast.success('WhatsApp Group registered successfully!');
            setIsAddModalOpen(false);
            setNewGroup({ name: '', link: '', description: '', category: 'General', icon_url: '' });
            fetchGroups();
        } catch (error) {
            console.error('Error adding group:', error);
            toast.error('Failed to register group');
        }
    };

    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for your class group..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm transition-all"
                    />
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 shrink-0"
                >
                    <Icons.Plus size={18} />
                    Register Group
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.Users className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No groups found</h3>
                    <p className="text-gray-500 text-sm mb-4">Try searching for a different keyword.</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                        Register a Group
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGroups.map(group => (
                        <div key={group.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Icons.MessageCircle size={80} className="text-green-500 rotate-12" />
                            </div>

                            <div className="flex items-start justify-between mb-4 relative">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold shadow-sm">
                                    {group.icon_url ? <img src={group.icon_url} alt={group.name} className="w-full h-full object-cover rounded-xl" /> : <Icons.Users size={24} />}
                                </div>
                                <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-green-100">
                                    {group.category}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 relative">{group.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 line-clamp-2 relative min-h-[40px]">{group.description}</p>

                            <a
                                href={group.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-200"
                            >
                                <Icons.MessageCircle size={18} />
                                Join Group
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Group Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Register WhatsApp Group</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Icons.X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Group Name</label>
                                <input
                                    type="text"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                                    placeholder="e.g., MBA 2nd Sem - General Discussion"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Group Link</label>
                                <input
                                    type="url"
                                    value={newGroup.link}
                                    onChange={(e) => setNewGroup({ ...newGroup, link: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                                    placeholder="https://chat.whatsapp.com/..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <select
                                    value={newGroup.category}
                                    onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none bg-white"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none min-h-[80px]"
                                    placeholder="Brief description of the group"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Icon URL (Optional)</label>
                                <input
                                    type="url"
                                    value={newGroup.icon_url}
                                    onChange={(e) => setNewGroup({ ...newGroup, icon_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                                    placeholder="https://example.com/icon.png"
                                />
                            </div>

                            <button
                                onClick={handleAddGroup}
                                disabled={!newGroup.name || !newGroup.link}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Register Group
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
