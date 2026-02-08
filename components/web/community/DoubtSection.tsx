"use client"

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Icons } from '@/components/shared/Icons';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Assuming you have these or use standard HTML dialog
// If UI components are not available, I will build a custom modal.
// Using custom modal for simplicity and to match existing patterns if UI lib is scarce.

interface Doubt {
    id: string;
    title: string;
    description: string;
    tags: string[];
    likes: number;
    is_anonymous: boolean;
    category: string;
    created_at: string;
    user_id: string;
    profiles?: {
        full_name: string;
        avatar_url: string;
        role: string;
    };
    comments_count?: number;
}

export function DoubtSection() {
    const supabase = createClientComponentClient();
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);

    // Form State
    const [newDoubt, setNewDoubt] = useState({
        title: '',
        description: '',
        tags: '',
        is_anonymous: false,
        category: 'General'
    });

    const categories = ['All', 'General', 'Mathematics', 'Physics', 'Computer Science', 'Management', 'Economics'];

    useEffect(() => {
        fetchDoubts();
    }, []);

    const fetchDoubts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('doubts')
                .select(`
                    *,
                    profiles:users (
                        full_name,
                        avatar_url,
                        role
                    ),
                    comments_count:doubt_comments(count)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDoubts(data || []);
        } catch (error) {
            console.error('Error fetching doubts:', error);
            toast.error('Failed to load doubts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAskDoubt = async () => {
        if (!newDoubt.title.trim() || !newDoubt.description.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('You must be logged in to ask a doubt');
                return;
            }

            const tagsArray = newDoubt.tags.split(',').map(t => t.trim()).filter(t => t);

            const { error } = await supabase
                .from('doubts')
                .insert({
                    user_id: user.id,
                    title: newDoubt.title,
                    description: newDoubt.description,
                    tags: tagsArray,
                    is_anonymous: newDoubt.is_anonymous,
                    category: newDoubt.category
                });

            if (error) throw error;

            toast.success('Doubt posted successfully!');
            setIsAskModalOpen(false);
            setNewDoubt({ title: '', description: '', tags: '', is_anonymous: false, category: 'General' });
            fetchDoubts();
        } catch (error) {
            console.error('Error posting doubt:', error);
            toast.error('Failed to post doubt');
        }
    };

    const handleLike = async (doubtId: string, currentLikes: number) => {
        // Optimistic update
        setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, likes: currentLikes + 1 } : d));

        try {
            const { error } = await supabase
                .from('doubts')
                .update({ likes: currentLikes + 1 })
                .eq('id', doubtId);

            if (error) throw error;
        } catch (error) {
            console.error('Error liking doubt:', error);
            // Revert
            setDoubts(prev => prev.map(d => d.id === doubtId ? { ...d, likes: currentLikes } : d));
            toast.error('Failed to like doubt');
        }
    };

    const filteredDoubts = doubts.filter(doubt => {
        const matchesSearch = doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doubt.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || doubt.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search doubts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setIsAskModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 shrink-0"
                >
                    <Icons.Plus size={18} />
                    Ask Doubt
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Icons.Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                    <p className="text-gray-400 text-sm font-medium">Loading discussions...</p>
                </div>
            ) : filteredDoubts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.MessageCircle className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No doubts found</h3>
                    <p className="text-gray-500 text-sm mb-6">Be the first to ask a question in this category!</p>
                    <button
                        onClick={() => setIsAskModalOpen(true)}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                        Ask a Question
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredDoubts.map(doubt => (
                        <div key={doubt.id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${doubt.is_anonymous ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {doubt.is_anonymous ? <Icons.User size={20} /> : <span className="uppercase">{doubt.profiles?.full_name?.[0] || 'U'}</span>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            {doubt.is_anonymous ? 'Anonymous Student' : doubt.profiles?.full_name || 'Unknown User'}
                                            {doubt.profiles?.role === 'faculty' && (
                                                <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] uppercase font-black tracking-wider">
                                                    <Icons.Shield size={10} /> Faculty
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400 flex items-center gap-2">
                                            <span>{formatDistanceToNow(new Date(doubt.created_at), { addSuffix: true })}</span>
                                            <span>•</span>
                                            <span className="text-blue-500 font-medium">{doubt.category}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                    <Icons.MessageCircle size={14} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-600">{doubt.comments_count?.[0]?.count || 0}</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {doubt.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                {doubt.description}
                            </p>

                            {doubt.tags && doubt.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {doubt.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md font-medium border border-gray-100">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleLike(doubt.id, doubt.likes)}
                                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
                                >
                                    <Icons.Heart size={16} />
                                    {doubt.likes} Likes
                                </button>
                                <button className="text-blue-600 text-sm font-bold hover:underline">
                                    View Discussion
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Modal for "Ask Doubt" */}
            {isAskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Ask a Doubt</h3>
                            <button onClick={() => setIsAskModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Icons.X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newDoubt.title}
                                    onChange={(e) => setNewDoubt({ ...newDoubt, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    placeholder="e.g., How to solve quadratic equations?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <select
                                    value={newDoubt.category}
                                    onChange={(e) => setNewDoubt({ ...newDoubt, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                >
                                    {categories.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newDoubt.description}
                                    onChange={(e) => setNewDoubt({ ...newDoubt, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[120px]"
                                    placeholder="Describe your doubt in detail..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={newDoubt.tags}
                                    onChange={(e) => setNewDoubt({ ...newDoubt, tags: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    placeholder="e.g., algebra, math, homework"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer" onClick={() => setNewDoubt({ ...newDoubt, is_anonymous: !newDoubt.is_anonymous })}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newDoubt.is_anonymous ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                    {newDoubt.is_anonymous && <Icons.Check size={14} className="text-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-700">Post anonymously</span>
                            </div>

                            <button
                                onClick={handleAskDoubt}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            >
                                Post Doubt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
