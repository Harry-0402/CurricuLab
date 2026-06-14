"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Icons } from '@/components/shared/Icons';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useSemester } from '@/components/providers/SemesterProvider';
import { SubjectService } from '@/lib/data/subject-service';

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
    comments_count?: { count: number }[];
}

export function DoubtSection() {
    const { activeSemesterId } = useSemester();
    const [doubts, setDoubts] = useState<Doubt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>(['All', 'General']);

    // Form State
    const [newDoubt, setNewDoubt] = useState({
        title: '',
        description: '',
        tags: '',
        is_anonymous: false,
        category: 'General'
    });

    useEffect(() => {
        if (activeSemesterId) {
            fetchDoubts();
        }
        getCurrentUser();
    }, [activeSemesterId]);

    useEffect(() => {
        const loadDynamicCategories = async () => {
            if (activeSemesterId) {
                const subjects = await SubjectService.getAll(activeSemesterId);
                const codes = subjects.map(s => s.code).filter(Boolean);
                setCategories(['All', 'General', ...codes]);
                setSelectedCategory('All'); // Reset selected category filter on semester change
            }
        };
        loadDynamicCategories();
    }, [activeSemesterId]);

    const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
    };

    const fetchDoubts = async () => {
        if (!activeSemesterId) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('doubts')
                .select(`
                    *,
                    profiles (
                        full_name,
                        avatar_url,
                        role
                    ),
                    comments_count:doubt_comments(count)
                `)
                .eq('semester_id', activeSemesterId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDoubts(data as unknown as Doubt[] || []);
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
                    category: newDoubt.category,
                    semester_id: activeSemesterId
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

    const handleLike = async (doubtId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Please login to like');
                return;
            }

            // Check if user already liked this doubt
            const { data: existingLike } = await supabase
                .from('doubt_likes')
                .select('id')
                .eq('doubt_id', doubtId)
                .eq('user_id', user.id)
                .single();

            if (existingLike) {
                // Unlike - remove the like
                const { error: deleteError } = await supabase
                    .from('doubt_likes')
                    .delete()
                    .eq('id', existingLike.id);

                if (deleteError) throw deleteError;

                // Decrement the counter
                const doubt = doubts.find(d => d.id === doubtId);
                if (doubt) {
                    await supabase
                        .from('doubts')
                        .update({ likes: Math.max(0, doubt.likes - 1) })
                        .eq('id', doubtId);
                }

                toast.success('Like removed');
            } else {
                // Like - add the like
                const { error: insertError } = await supabase
                    .from('doubt_likes')
                    .insert({ doubt_id: doubtId, user_id: user.id });

                if (insertError) throw insertError;

                // Increment the counter
                const doubt = doubts.find(d => d.id === doubtId);
                if (doubt) {
                    await supabase
                        .from('doubts')
                        .update({ likes: doubt.likes + 1 })
                        .eq('id', doubtId);
                }

                toast.success('Liked!');
            }

            // Refresh the list
            fetchDoubts();
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Failed to update like');
        }
    };

    const handleDelete = async (doubtId: string) => {
        if (!confirm('Are you sure you want to delete this doubt? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('doubts')
                .delete()
                .eq('id', doubtId);

            if (error) throw error;

            toast.success('Doubt deleted successfully');
            fetchDoubts();
        } catch (error) {
            console.error('Error deleting doubt:', error);
            toast.error('Failed to delete doubt');
        }
    };

    const handleViewDoubt = async (doubt: Doubt) => {
        setSelectedDoubt(doubt);
        setIsCommentsLoading(true);
        try {
            const { data, error } = await supabase
                .from('doubt_comments')
                .select(`
                    *,
                    profiles (
                        full_name,
                        avatar_url,
                        role
                    )
                `)
                .eq('doubt_id', doubt.id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
        } finally {
            setIsCommentsLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim() || !selectedDoubt) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Please login to reply');
                return;
            }

            const { error } = await supabase
                .from('doubt_comments')
                .insert({
                    doubt_id: selectedDoubt.id,
                    user_id: user.id,
                    content: newComment,
                    is_faculty_reply: false // Backend can override based on user role if needed
                });

            if (error) throw error;

            toast.success('Reply posted!');
            setNewComment('');
            // Refresh comments
            handleViewDoubt(selectedDoubt);
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post reply');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('doubt_comments')
                .delete()
                .eq('id', commentId);

            if (error) throw error;

            toast.success('Comment deleted successfully');
            // Refresh comments
            if (selectedDoubt) {
                handleViewDoubt(selectedDoubt);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
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
                <div className="relative w-full md:w-60">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search doubts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${selectedCategory === cat
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
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
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                        <Icons.MessageCircle size={14} className="text-gray-400" />
                                        <span className="text-xs font-bold text-gray-600">{doubt.comments_count?.[0]?.count || 0}</span>
                                    </div>
                                    {currentUserId === doubt.user_id && (
                                        <button
                                            onClick={() => handleDelete(doubt.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group/delete"
                                            title="Delete doubt"
                                        >
                                            <Icons.Trash2 size={16} className="text-gray-400 group-hover/delete:text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleViewDoubt(doubt)}>
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
                                    onClick={() => handleLike(doubt.id)}
                                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
                                >
                                    <Icons.Heart size={16} />
                                    {doubt.likes} Likes
                                </button>
                                <button
                                    onClick={() => handleViewDoubt(doubt)}
                                    className="text-blue-600 text-sm font-bold hover:underline"
                                >
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
                                disabled={!newDoubt.title || !newDoubt.description}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post Doubt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Doubt & Comments Modal */}
            {selectedDoubt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-gray-900">Discussion</h3>
                            <button onClick={() => setSelectedDoubt(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Icons.X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            {/* Selected Doubt Content */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${selectedDoubt.is_anonymous ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {selectedDoubt.is_anonymous ? <Icons.User size={24} /> : <span className="uppercase">{selectedDoubt.profiles?.full_name?.[0] || 'U'}</span>}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{selectedDoubt.title}</h4>
                                        <p className="text-sm text-gray-500">
                                            Posted by <span className="font-medium text-gray-900">{selectedDoubt.is_anonymous ? 'Anonymous' : selectedDoubt.profiles?.full_name}</span> • {formatDistanceToNow(new Date(selectedDoubt.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                <div className="prose prose-blue max-w-none text-gray-700">
                                    {selectedDoubt.description}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Icons.MessageCircle size={18} />
                                    Replies ({comments.length})
                                </h4>

                                {isCommentsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Icons.Loader2 className="animate-spin text-blue-500" />
                                    </div>
                                ) : comments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8 italic">No replies yet. Be the first to help!</p>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment.id} className={`p-4 rounded-xl border ${comment.is_faculty_reply ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-gray-900">
                                                        {comment.profiles?.full_name || 'User'}
                                                    </span>
                                                    {comment.is_faculty_reply && (
                                                        <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                                            <Icons.Shield size={10} /> Faculty
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-400">• {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                                                </div>
                                                {currentUserId === comment.user_id && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="p-1 hover:bg-red-50 rounded transition-colors group/delete"
                                                        title="Delete comment"
                                                    >
                                                        <Icons.Trash2 size={14} className="text-gray-400 group-hover/delete:text-red-600" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Reply Input */}
                        <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a helpful reply..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                />
                                <button
                                    onClick={handlePostComment}
                                    disabled={!newComment.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    <Icons.Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
