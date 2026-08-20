"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Subject, Unit } from '@/types';
import {
    getYoutubeVideos,
    createYoutubeVideo,
    updateYoutubeVideo,
    deleteYoutubeVideo,
    YoutubeVideo,
} from '@/lib/services/app.service';
import { toast } from 'sonner';

import { SubjectService } from '@/lib/data/subject-service';
import { UnitService } from '@/lib/data/unit-service';
import { useSemester } from '@/components/providers/SemesterProvider';
import { useAuth } from '@/components/providers/AuthProvider';

// ─── helpers ─────────────────────────────────────────────────────────────────

const getYoutubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    try {
        if (url.includes('youtube.com/watch')) {
            const urlObj = new URL(url);
            const v = urlObj.searchParams.get('v');
            return v ? `https://www.youtube.com/embed/${v}` : url;
        }
        if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes('youtube.com/embed/')) return url;
        return url; // search results / playlist – not embeddable
    } catch {
        return url;
    }
};

const isEmbeddable = (url: string) =>
    url.includes('youtube.com/watch') ||
    url.includes('youtu.be/') ||
    url.includes('youtube.com/embed/');

const UNIT_LABELS: Record<string, string> = {
    'unit-1': 'Unit 1',
    'unit-2': 'Unit 2',
    'unit-3': 'Unit 3',
    'unit-4': 'Unit 4',
    'unit-5': 'Unit 5',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function YoutubeLibraryContent() {
    const { activeSemesterId } = useSemester();
    const { isAdmin, sessionToken } = useAuth();

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string>('');
    const [videos, setVideos] = useState<YoutubeVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Filters
    const [selectedUnitId, setSelectedUnitId] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Viewer
    const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null);
    const [scrapingVideoId, setScrapingVideoId] = useState<string | null>(null);
    const [activeAlternativeId, setActiveAlternativeId] = useState<string | null>(null);
    const [visibleVideoCount, setVisibleVideoCount] = useState<number>(10);

    // Add / Edit modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ subjectId: '', unitId: '', title: '', url: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Delete confirm
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // ── data loading ──────────────────────────────────────────────────────────

    useEffect(() => {
        if (!activeSemesterId) return;
        let ignore = false;
        const load = async () => {
            setLoading(true);
            const fetched = await SubjectService.getAll(activeSemesterId);
            if (ignore) return;
            setSubjects(fetched);
            if (fetched.length > 0) {
                setActiveSubjectId(fetched[0].id);
            } else {
                setActiveSubjectId('');
                setVideos([]);
                setLoading(false);
            }
            setIsInitialLoad(false);
        };
        load();
        return () => { ignore = true; };
    }, [activeSemesterId]);

    useEffect(() => {
        let ignore = false;
        const load = async () => {
            if (isInitialLoad || !activeSubjectId) return;
            setLoading(true);
            const data = await getYoutubeVideos({ subjectId: activeSubjectId });
            if (ignore) return;
            setVideos(data);
            setLoading(false);
        };
        load();
        return () => { ignore = true; };
    }, [activeSubjectId, isInitialLoad]);

    // ── derived ───────────────────────────────────────────────────────────────

    const unitIds = useMemo(() => {
        const ids = new Set(videos.map(v => v.unitId).filter(Boolean));
        return Array.from(ids).sort() as string[];
    }, [videos]);

    const filteredVideos = useMemo(() => {
        return videos
            .filter(v => selectedUnitId === 'all' || v.unitId === selectedUnitId)
            .filter(v =>
                !searchQuery.trim() ||
                v.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
            );
    }, [videos, selectedUnitId, searchQuery]);

    // ── handlers ──────────────────────────────────────────────────────────────

    const handleOpenAddModal = () => {
        setEditingId(null);
        setFormData({ subjectId: activeSubjectId, unitId: '', title: '', url: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (e: React.MouseEvent, video: YoutubeVideo) => {
        e.stopPropagation();
        setEditingId(video.id);
        setFormData({ subjectId: video.subjectId, unitId: video.unitId || '', title: video.title, url: video.url });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.subjectId || !formData.title || !formData.url) return;
        setIsSaving(true);
        try {
            const payload = { subjectId: formData.subjectId, unitId: formData.unitId, title: formData.title, url: formData.url, tags: [] };
            if (editingId) {
                const updated = await updateYoutubeVideo({ id: editingId, ...payload }, sessionToken);
                if (updated) {
                    setVideos(prev => prev.map(v => v.id === editingId ? updated : v));
                    if (selectedVideo?.id === editingId) setSelectedVideo(updated);
                    toast.success('Video updated!');
                    setIsModalOpen(false);
                }
            } else {
                const created = await createYoutubeVideo(payload, sessionToken);
                if (created) {
                    setVideos(prev => [created, ...prev]);
                    toast.success('Video added!');
                    setIsModalOpen(false);
                }
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmId) return;
        const ok = await deleteYoutubeVideo(deleteConfirmId, sessionToken);
        if (ok) {
            setVideos(prev => prev.filter(v => v.id !== deleteConfirmId));
            if (selectedVideo?.id === deleteConfirmId) setSelectedVideo(null);
            toast.info('Video removed');
        }
        setDeleteConfirmId(null);
    };

    const handleCardClick = async (video: YoutubeVideo) => {
        setVisibleVideoCount(10);
        if (isEmbeddable(video.url)) {
            setSelectedVideo(video);
            setActiveAlternativeId(null);
        } else {
            // Unembeddable -> Search Component overlay
            if (video.videoPayload && video.videoPayload.length > 0) {
                setSelectedVideo(video);
                setActiveAlternativeId(video.videoPayload[0].videoId);
                return;
            }
            
            try {
                setScrapingVideoId(video.id);
                const res = await fetch(`/api/youtube-search?id=${video.id}`);
                const json = await res.json();
                
                if (res.ok && json.data) {
                    // Update local state so it doesn't fetch again
                    const updatedVideo = { ...video, videoPayload: json.data };
                    setVideos(prev => prev.map(v => v.id === video.id ? updatedVideo : v));
                    setSelectedVideo(updatedVideo);
                    setActiveAlternativeId(json.data[0]?.videoId || null);
                } else {
                    toast.error(json.error || 'Failed to fetch search results.');
                    window.open(video.url, '_blank'); // fallback
                }
            } catch (err) {
                console.error(err);
                toast.error('Network error. Falling back to new tab.');
                window.open(video.url, '_blank');
            } finally {
                setScrapingVideoId(null);
            }
        }
    };

    // ── render ────────────────────────────────────────────────────────────────

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-5 max-w-[1800px] mx-auto">

            {/* ── Header ── */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em] hidden sm:block">Library</h1>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 rounded-xl sm:rounded-2xl bg-red-50 hidden sm:block">
                            <Icons.Youtube className="text-red-600 sm:w-7 sm:h-7" size={20} />
                        </div>
                        <p className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tight">YouTube Library</p>
                    </div>
                </div>
                {isAdmin && (
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-red-600 text-white rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 shrink-0"
                    >
                        <Icons.Plus size={16} className="md:hidden" />
                        <Icons.Plus size={18} className="hidden md:block" />
                        <span className="hidden sm:inline">Add Video</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                )}
            </div>

            {/* Subject + Unit — Mobile: 2 side-by-side dropdowns */}
            <div className="block sm:hidden">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <select
                            value={activeSubjectId}
                            onChange={(e) => { setActiveSubjectId(e.target.value); setSelectedVideo(null); setSelectedUnitId('all'); }}
                            className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 pr-8 cursor-pointer"
                        >
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.code} — {subject.title}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <Icons.ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </div>
                    <div className="relative flex-1">
                        <select
                            value={selectedUnitId}
                            onChange={(e) => setSelectedUnitId(e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 pr-8 cursor-pointer"
                        >
                            <option value="all">All Units</option>
                            {unitIds.map(uid => (
                                <option key={uid} value={uid}>{UNIT_LABELS[uid] ?? uid}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <Icons.ChevronDown size={14} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject switcher — Desktop Pills */}
            <div className="hidden sm:flex flex-wrap items-center gap-2 shrink-0">
                {subjects.map(subject => {
                    const isActive = activeSubjectId === subject.id;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => { setActiveSubjectId(subject.id); setSelectedVideo(null); setSelectedUnitId('all'); }}
                            title={subject.title}
                            className={cn(
                                'px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1.5 border shadow-sm text-xs font-bold',
                                isActive
                                    ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-red-200 hover:text-red-600'
                            )}
                        >
                            <span className="tracking-wide uppercase">{subject.code || subject.title.substring(0, 6)}</span>
                            {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />}
                        </button>
                    );
                })}
            </div>

            {/* ── Search + Unit filters ── */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search videos…"
                        className="w-full pl-9 pr-4 py-2 text-sm font-medium bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-400 outline-none transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <Icons.X size={13} />
                        </button>
                    )}
                </div>

            {/* Unit pills — Desktop only */}
                <div className="hidden sm:flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setSelectedUnitId('all')}
                        className={cn(
                            'px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all border',
                            selectedUnitId === 'all'
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                        )}
                    >
                        All Units
                    </button>
                    {unitIds.map(uid => (
                        <button
                            key={uid}
                            onClick={() => setSelectedUnitId(uid)}
                            className={cn(
                                'px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all border',
                                selectedUnitId === uid
                                    ? 'bg-red-600 text-white border-red-600'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-red-200 hover:text-red-600'
                            )}
                        >
                            {UNIT_LABELS[uid] ?? uid}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Stats bar ── */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-red-600 bg-red-50/60 border border-red-100/60 px-4 py-3 rounded-2xl shrink-0">
                <Icons.Youtube size={14} className="shrink-0 text-red-500" />
                <span>
                    <strong>{filteredVideos.length}</strong> video{filteredVideos.length !== 1 ? 's' : ''}
                    {selectedUnitId !== 'all' ? ` in ${UNIT_LABELS[selectedUnitId] ?? selectedUnitId}` : ' across all units'}
                    {searchQuery ? ` matching "${searchQuery}"` : ''}.
                    {' '}Click a card to watch inline, or <strong>Open in YouTube</strong> for the full experience.
                </span>
            </div>

            {/* ── Grid ── */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm font-medium text-gray-500">Loading videos…</p>
                        </div>
                    </div>
                ) : filteredVideos.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Icons.Youtube className="mx-auto mb-4 text-gray-200" size={64} />
                            <p className="text-lg font-bold text-gray-400">No videos found</p>
                            <p className="text-sm text-gray-400 mt-2">
                                {isAdmin ? 'Click "Add Video" to get started.' : 'Check back soon!'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                        {['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-5', ''].flatMap(unitKey => 
                            filteredVideos.filter(v => (v.unitId || '') === unitKey)
                        ).map(video => (
                            <div
                                key={video.id}
                                onClick={() => handleCardClick(video)}
                                className="bg-white rounded-3xl p-5 border border-gray-100 hover:border-red-200 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative flex flex-col"
                            >
                                {/* Play thumbnail */}
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-red-100 mb-4 flex items-center justify-center shrink-0">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-110 transition-transform duration-300">
                                            <Icons.Play className="text-white ml-1" size={22} fill="white" />
                                        </div>
                                    </div>
                                    <Icons.Youtube className="absolute bottom-3 right-3 text-red-300 opacity-60" size={20} />
                                </div>

                                {/* Meta */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-100">
                                        YouTube Video
                                    </span>
                                    {video.unitId && (
                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-gray-50 text-gray-500 border border-gray-100">
                                            {video.unitId.replace('unit-', 'Unit ')}
                                        </span>
                                    )}
                                    {isAdmin && (
                                        <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={e => handleOpenEditModal(e, video)}
                                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Icons.Edit size={14} />
                                            </button>
                                            <button
                                                onClick={e => handleDeleteClick(e, video.id)}
                                                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Icons.Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors flex-grow">
                                    {video.title}
                                </h3>

                                {/* Footer */}
                                <div className="pt-3 mt-3 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400">
                                    <span>{new Date(video.createdAt || new Date()).toLocaleDateString()}</span>
                                    {scrapingVideoId === video.id ? (
                                        <span className="flex items-center gap-1 text-red-500 font-bold">
                                            <Icons.Loader2 size={12} className="animate-spin" /> Fetching...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-500 font-bold group-hover:translate-x-1 transition-transform">
                                            {isEmbeddable(video.url) ? 'Watch' : 'Search'} <Icons.ArrowRight size={12} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Video Viewer Modal ── */}
            {selectedVideo && !isModalOpen && !deleteConfirmId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className={cn(
                        "bg-white rounded-[32px] w-full flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden",
                        selectedVideo.videoPayload?.length ? "max-w-5xl" : "max-w-5xl"
                    )} style={{ maxHeight: '92vh', height: selectedVideo.videoPayload?.length ? '92vh' : 'auto' }}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 rounded-xl bg-red-50 shrink-0">
                                    <Icons.Youtube className="text-red-600" size={20} />
                                </div>
                                <div className="min-w-0">
                                    {selectedVideo.unitId && (
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                            {selectedVideo.unitId.replace('unit-', 'Unit ')}
                                        </p>
                                    )}
                                    <h2 className="text-lg font-black text-gray-900 truncate">{selectedVideo.title}</h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <button
                                    onClick={() => window.open(selectedVideo.url, '_blank')}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                                >
                                    <Icons.ExternalLink size={15} />
                                    <span className="hidden sm:inline">Open in YouTube</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedVideo(null); setActiveAlternativeId(null); }}
                                    className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                                >
                                    <Icons.X size={22} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        {selectedVideo.videoPayload && selectedVideo.videoPayload.length > 0 ? (
                            <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">
                                {/* Main Player */}
                                <div className="w-full bg-black shrink-0 relative">
                                    <div className="relative w-full aspect-video">
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${activeAlternativeId}?autoplay=1&rel=0`}
                                            title={selectedVideo.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                                {/* Alternatives List */}
                                <div className="w-full p-6 flex flex-col gap-4 border-t border-gray-200 bg-white">
                                    <h3 className="text-sm font-bold text-gray-900 mb-2 px-1">Related Videos</h3>
                                    {selectedVideo.videoPayload.slice(0, visibleVideoCount).map((alt: any) => (
                                        <button 
                                            key={alt.videoId} 
                                            onClick={() => setActiveAlternativeId(alt.videoId)}
                                            className={cn(
                                                "flex gap-3 p-2 rounded-xl text-left transition-colors",
                                                activeAlternativeId === alt.videoId ? "bg-red-50 border border-red-100" : "hover:bg-gray-50 border border-transparent"
                                            )}
                                        >
                                            <div className="w-32 aspect-video bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                                                <img src={alt.thumbnail} alt={alt.title} className="w-full h-full object-cover" />
                                                {activeAlternativeId === alt.videoId && (
                                                    <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                                                        <Icons.Play className="text-white fill-white drop-shadow-md" size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0 flex-1">
                                                <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{alt.title}</p>
                                                <p className="text-xs font-medium text-gray-500 truncate">{alt.channelName}</p>
                                            </div>
                                            {(alt.ago || alt.rating) && (
                                                <div className="flex flex-col items-end justify-center shrink-0 ml-2 gap-1.5">
                                                    {alt.rating && (
                                                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-black rounded-md border border-green-200 shadow-sm">
                                                            {alt.rating}/10 Match
                                                        </span>
                                                    )}
                                                    {alt.ago && (
                                                        <span className="text-[10px] font-bold text-gray-400">
                                                            {alt.ago}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    {selectedVideo.videoPayload.length > visibleVideoCount && (
                                        <button 
                                            onClick={() => setVisibleVideoCount(prev => prev + 15)}
                                            className="w-full py-3 mt-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                                        >
                                            Load More Videos...
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* 16:9 embed (Fallback) */
                            <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={getYoutubeEmbedUrl(selectedVideo.url)}
                                    title={selectedVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Add / Edit Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl p-8 animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {editingId ? 'Edit Video' : 'Add YouTube Video'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {editingId ? 'Update the video details below.' : 'Paste any YouTube link to add it to the library.'}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Icons.X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Subject */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">Subject</label>
                                <div className="relative">
                                    <select
                                        value={formData.subjectId}
                                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-400 outline-none appearance-none"
                                    >
                                        <option value="">Select Subject…</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.code} – {s.title}</option>
                                        ))}
                                    </select>
                                    <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Unit */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">
                                    Unit <span className="text-gray-300 font-normal normal-case">(Optional)</span>
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(unit => {
                                        const uid = `unit-${unit}`;
                                        const isActive = formData.unitId === uid;
                                        return (
                                            <button
                                                key={unit}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, unitId: isActive ? '' : uid })}
                                                className={cn(
                                                    'flex-1 h-10 rounded-xl text-xs font-bold transition-all border',
                                                    isActive
                                                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                                )}
                                            >
                                                U{unit}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Descriptive video title…"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-400 outline-none placeholder:font-medium placeholder:text-gray-400"
                                />
                            </div>

                            {/* YouTube URL */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">YouTube Link</label>
                                <div className="relative">
                                    <Icons.Youtube className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={16} />
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=…"
                                        className="w-full p-4 pl-10 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-400 outline-none placeholder:font-medium placeholder:text-gray-400"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5 pl-1">
                                    Watch links embed inline. Search/playlist links open in a new tab.
                                </p>
                            </div>

                            {/* Save */}
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !formData.title || !formData.subjectId || !formData.url}
                                className="w-full py-4 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-[22px] text-sm font-black uppercase tracking-widest shadow-xl shadow-red-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
                            >
                                {isSaving
                                    ? <Icons.Loader2 className="animate-spin" size={18} />
                                    : (editingId ? <Icons.Save size={18} /> : <Icons.Plus size={18} />)
                                }
                                {isSaving ? (editingId ? 'Updating…' : 'Saving…') : (editingId ? 'Update Video' : 'Add Video')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete confirm ── */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="text-center space-y-4">
                            <div className="w-14 h-14 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                                <Icons.AlertTriangle className="text-red-500" size={28} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900">Remove Video?</h3>
                            <p className="text-sm text-gray-500">This will permanently remove it from the library.</p>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
