"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { SkillForgeResource, SkillForgeResourceStatus, SkillForgeResourceType, SkillForgeTrack } from '@/types';
import { getResources, createResource, updateResource, deleteResource, getTracks } from '@/lib/services/skillforge.service';
import { toast } from 'sonner';

const statusOptions: { value: SkillForgeResourceStatus; label: string; color: string }[] = [
    { value: 'not_started', label: 'Not Started', color: 'bg-gray-100 text-gray-700' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
    { value: 'wishlist', label: 'Wishlist', color: 'bg-purple-100 text-purple-700' },
];

const typeOptions: { value: SkillForgeResourceType; label: string; icon: any }[] = [
    { value: 'course', label: 'Course', icon: Icons.GraduationCap },
    { value: 'video', label: 'Video', icon: Icons.Video },
    { value: 'article', label: 'Article', icon: Icons.FileText },
    { value: 'book', label: 'Book', icon: Icons.BookOpen },
    { value: 'podcast', label: 'Podcast', icon: Icons.Music },
    { value: 'tutorial', label: 'Tutorial', icon: Icons.Code2 },
    { value: 'other', label: 'Other', icon: Icons.Link },
];

const platformOptions = ['Coursera', 'Udemy', 'YouTube', 'Pluralsight', 'LinkedIn Learning', 'freeCodeCamp', 'Medium', 'Dev.to', 'Other'];

const detectPlatform = (url: string): string => {
    if (url.includes('coursera')) return 'Coursera';
    if (url.includes('udemy')) return 'Udemy';
    if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('pluralsight')) return 'Pluralsight';
    if (url.includes('linkedin.com/learning')) return 'LinkedIn Learning';
    if (url.includes('freecodecamp')) return 'freeCodeCamp';
    if (url.includes('medium')) return 'Medium';
    if (url.includes('dev.to')) return 'Dev.to';
    return 'Other';
};

export function ResourcesTab() {
    const [resources, setResources] = useState<SkillForgeResource[]>([]);
    const [tracks, setTracks] = useState<SkillForgeTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<SkillForgeResourceStatus | 'all'>('all');
    const [trackFilter, setTrackFilter] = useState<string | 'all'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState<SkillForgeResource | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        platform: 'Other',
        type: 'course' as SkillForgeResourceType,
        status: 'not_started' as SkillForgeResourceStatus,
        trackId: '',
        notes: '',
        priority: 3
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [resourcesData, tracksData] = await Promise.all([getResources(), getTracks()]);
        setResources(resourcesData);
        setTracks(tracksData);
        setLoading(false);
    };

    const filteredResources = resources.filter(r => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (trackFilter !== 'all' && r.trackId !== trackFilter) return false;
        return true;
    });

    const groupedByPlatform = filteredResources.reduce((acc, r) => {
        if (!acc[r.platform]) acc[r.platform] = [];
        acc[r.platform].push(r);
        return acc;
    }, {} as Record<string, SkillForgeResource[]>);

    const handleUrlChange = (url: string) => {
        setFormData({
            ...formData,
            url,
            platform: detectPlatform(url)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingResource) {
            const updated = await updateResource({ ...editingResource, ...formData, trackId: formData.trackId || undefined });
            if (updated) {
                setResources(resources.map(r => r.id === updated.id ? updated : r));
                toast.success('Resource updated successfully!');
            }
        } else {
            const created = await createResource({ ...formData, trackId: formData.trackId || undefined });
            if (created) {
                setResources([created, ...resources]);
                toast.success('Resource added successfully!');
            }
        }

        resetForm();
    };

    const handleEdit = (resource: SkillForgeResource) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title,
            url: resource.url || '',
            platform: resource.platform,
            type: resource.type,
            status: resource.status,
            trackId: resource.trackId || '',
            notes: resource.notes || '',
            priority: resource.priority
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this resource?')) {
            const success = await deleteResource(id);
            if (success) {
                setResources(resources.filter(r => r.id !== id));
                toast.success('Resource deleted!');
            }
        }
    };

    const handleStatusChange = async (resource: SkillForgeResource, newStatus: SkillForgeResourceStatus) => {
        const updated = await updateResource({ ...resource, status: newStatus });
        if (updated) {
            setResources(resources.map(r => r.id === updated.id ? updated : r));
            toast.success('Status updated!');
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditingResource(null);
        setFormData({
            title: '',
            url: '',
            platform: 'Other',
            type: 'course',
            status: 'not_started',
            trackId: '',
            notes: '',
            priority: 3
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Learning Resources</h2>
                    <p className="text-gray-500 text-sm">Curate courses, videos, and articles for your learning journey</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                    <Icons.Plus size={18} />
                    Add Resource
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            statusFilter === 'all' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        All
                    </button>
                    {statusOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setStatusFilter(opt.value)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                statusFilter === opt.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {tracks.length > 0 && (
                    <select
                        value={trackFilter}
                        onChange={(e) => setTrackFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="all">All Tracks</option>
                        {tracks.map(t => (
                            <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Resources by Platform */}
            {filteredResources.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <Icons.BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No resources yet</h3>
                    <p className="text-gray-400 text-sm mt-1">Add your first learning resource</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedByPlatform).map(([platform, items]) => (
                        <div key={platform}>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{platform}</h3>
                            <div className="space-y-2">
                                {items.map(resource => {
                                    const statusInfo = statusOptions.find(s => s.value === resource.status);
                                    const typeInfo = typeOptions.find(t => t.value === resource.type);
                                    const TypeIcon = typeInfo?.icon || Icons.Link;
                                    const track = tracks.find(t => t.id === resource.trackId);

                                    return (
                                        <div
                                            key={resource.id}
                                            className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all group flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                                <TypeIcon size={20} className="text-orange-600" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900 truncate">{resource.title}</h4>
                                                    {track && (
                                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">
                                                            {track.icon} {track.title}
                                                        </span>
                                                    )}
                                                </div>
                                                {resource.url && (
                                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-600 hover:underline truncate block">
                                                        {resource.url}
                                                    </a>
                                                )}
                                            </div>

                                            {/* Priority Stars */}
                                            <div className="flex gap-0.5 shrink-0">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Icons.Zap key={i} size={12} className={i <= resource.priority ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                                                ))}
                                            </div>

                                            {/* Status Dropdown */}
                                            <select
                                                value={resource.status}
                                                onChange={(e) => handleStatusChange(resource, e.target.value as SkillForgeResourceStatus)}
                                                className={cn("text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer", statusInfo?.color)}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>

                                            {/* Actions */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0">
                                                <button onClick={() => handleEdit(resource)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                                    <Icons.Edit size={14} className="text-gray-400" />
                                                </button>
                                                <button onClick={() => handleDelete(resource.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                                                    <Icons.Trash2 size={14} className="text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingResource ? 'Edit Resource' : 'Add Resource'}
                                </h3>
                                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl">
                                    <Icons.X size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={e => handleUrlChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Resource title"
                                />
                            </div>

                            {/* Type & Platform */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as SkillForgeResourceType })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                                    >
                                        {typeOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                    <select
                                        value={formData.platform}
                                        onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                                    >
                                        {platformOptions.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Track & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Link to Track</label>
                                    <select
                                        value={formData.trackId}
                                        onChange={e => setFormData({ ...formData, trackId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">No track</option>
                                        {tracks.map(t => (
                                            <option key={t.id} value={t.id}>{t.icon} {t.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as SkillForgeResourceStatus })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority: i })}
                                            className="p-2 hover:bg-gray-50 rounded-lg"
                                        >
                                            <Icons.Zap size={24} className={i <= formData.priority ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 resize-none"
                                    placeholder="Any notes about this resource..."
                                />
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
                                    className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700"
                                >
                                    {editingResource ? 'Update' : 'Add Resource'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
