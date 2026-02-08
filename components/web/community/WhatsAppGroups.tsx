"use client"

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Icons } from '@/components/shared/Icons';

interface WhatsAppGroup {
    id: string;
    name: string;
    link: string;
    description: string;
    category: string;
    icon_url?: string;
}

export function WhatsAppGroups() {
    const supabase = createClientComponentClient();
    const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('whatsapp_groups')
                    .select('*')
                    .order('name');
                if (error) throw error;
                setGroups(data || []);
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search for your class group..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm transition-all"
                />
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
                    <p className="text-gray-500 text-sm">Try searching for a different keyword.</p>
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
        </div>
    );
}
