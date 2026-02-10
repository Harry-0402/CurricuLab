"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { SkillForgeTrack, SkillForgeTrackStatus } from '@/types';
import { getTracks, createTrack, updateTrack, deleteTrack } from '@/lib/services/skillforge.service';
import { toast } from 'sonner';

const statusOptions: { value: SkillForgeTrackStatus; label: string; color: string }[] = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
    { value: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-700' },
    { value: 'wishlist', label: 'Wishlist', color: 'bg-gray-100 text-gray-700' },
];

const categoryOptions = [
    'Certification', 'Programming', 'Data Science', 'Cloud', 'Design',
    'Business', 'Language', 'Finance', 'Marketing', 'Other'
];

const iconOptions = ['🎯', '🚀', '💻', '📊', '🎨', '📈', '🔥', '⚡', '🌟', '🏆', '📚', '🧠'];
const colorOptions = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export function TracksTab() {
    const [tracks, setTracks] = useState<SkillForgeTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<SkillForgeTrackStatus | 'all'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingTrack, setEditingTrack] = useState<SkillForgeTrack | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        targetDate: '',
        status: 'active' as SkillForgeTrackStatus,
        progress: 0,
        color: '#3B82F6',
        icon: '🎯'
    });

    useEffect(() => {
        loadTracks();
    }, []);

    const loadTracks = async () => {
        setLoading(true);
        const data = await getTracks();
        setTracks(data);
        setLoading(false);
    };

    const filteredTracks = filter === 'all'
        ? tracks
        : tracks.filter(t => t.status === filter);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTrack) {
            const updated = await updateTrack({ ...editingTrack, ...formData });
            if (updated) {
                setTracks(tracks.map(t => t.id === updated.id ? updated : t));
                toast.success('Track updated successfully!');
            }
        } else {
            const created = await createTrack(formData);
            if (created) {
                setTracks([created, ...tracks]);
                toast.success('Track created successfully!');
            }
        }

        resetForm();
    };

    const handleEdit = (track: SkillForgeTrack) => {
        setEditingTrack(track);
        setFormData({
            title: track.title,
            description: track.description,
            category: track.category,
            targetDate: track.targetDate || '',
            status: track.status,
            progress: track.progress,
            color: track.color,
            icon: track.icon
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this track?')) {
            const success = await deleteTrack(id);
            if (success) {
                setTracks(tracks.filter(t => t.id !== id));
                toast.success('Track deleted successfully!');
            }
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditingTrack(null);
        setFormData({
            title: '',
            description: '',
            category: 'Other',
            targetDate: '',
            status: 'active',
            progress: 0,
            color: '#3B82F6',
            icon: '🎯'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Learning Tracks</h2>
                    <p className="text-gray-500 text-sm">Organize your learning goals into focused tracks</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                    <Icons.Plus size={18} />
                    New Track
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        filter === 'all' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                >
                    All ({tracks.length})
                </button>
                {statusOptions.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => setFilter(opt.value)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            filter === opt.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        {opt.label} ({tracks.filter(t => t.status === opt.value).length})
                    </button>
                ))}
            </div>

            {/* Tracks Grid */}
            {filteredTracks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl">
                    <Icons.LayoutDashboard size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No tracks yet</h3>
                    <p className="text-gray-400 text-sm mt-1">Create your first learning track to get started</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                        {filteredTracks.map(track => {
                            const statusInfo = statusOptions.find(s => s.value === track.status);
                            return (
                                <div
                                    key={track.id}
                                    className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all group"
                                    style={{ borderLeftColor: track.color, borderLeftWidth: '4px' }}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{track.icon}</span>
                                            <div>
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{track.title}</h3>
                                                <span className="text-xs text-gray-400">{track.category}</span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button onClick={() => handleEdit(track)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                                <Icons.Edit size={14} className="text-gray-400" />
                                            </button>
                                            <button onClick={() => handleDelete(track.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                                                <Icons.Trash2 size={14} className="text-red-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{track.description || 'No description'}</p>

                                    {/* Progress Bar */}
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="font-semibold" style={{ color: track.color }}>{track.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${track.progress}%`, backgroundColor: track.color }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", statusInfo?.color)}>
                                            {statusInfo?.label}
                                        </span>
                                        {track.targetDate && (
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Icons.Calendar size={12} />
                                                {new Date(track.targetDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-100 shrink-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingTrack ? 'Edit Track' : 'New Learning Track'}
                                </h3>
                                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl">
                                    <Icons.X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1">

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Icon & Color Selection */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {colorOptions.map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, color })}
                                                    className={cn(
                                                        "w-10 h-10 rounded-xl transition-all",
                                                        formData.color === color ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                        <div className="flex flex-wrap gap-2">
                                            {iconOptions.map(icon => (
                                                <button
                                                    key={icon}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon })}
                                                    className={cn(
                                                        "w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all",
                                                        formData.icon === icon ? "bg-blue-50 ring-2 ring-blue-500" : "bg-gray-50 hover:bg-gray-100"
                                                    )}
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., AWS Solutions Architect Certification"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="What do you want to achieve?"
                                    />
                                </div>

                                {/* Category & Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {categoryOptions.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value as SkillForgeTrackStatus })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Target Date & Progress */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                                        <input
                                            type="date"
                                            value={formData.targetDate}
                                            onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Progress: {formData.progress}%</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={formData.progress}
                                            onChange={e => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                                            className="w-full mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                                    >
                                        {editingTrack ? 'Update Track' : 'Create Track'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
