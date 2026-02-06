"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { getSubjects, getUnits } from '@/lib/services/app.service';
import { ClassroomMaterialService, ClassroomMaterial } from '@/lib/services/classroom-material-service';
import { SubmissionService } from '@/lib/services/submission-service';
import { Subject, Unit } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

// Custom Components
import { MaterialCard } from './classroom/MaterialCard';
import { UploadModal } from './classroom/UploadModal';
import { PreviewModal } from './classroom/PreviewModal';

export function ClassroomContent() {
    // State
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isDriveConnected, setIsDriveConnected] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Data State
    const [materials, setMaterials] = useState<ClassroomMaterial[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [mySubmissionsMap, setMySubmissionsMap] = useState<Record<string, { status: string; id: string }>>({});

    // Filter State
    const [activeSubject, setActiveSubject] = useState('all');
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<ClassroomMaterial | null>(null);
    const [previewMaterial, setPreviewMaterial] = useState<ClassroomMaterial | null>(null);

    // Initial Load - User & Drive Status
    useEffect(() => {
        const checkAuthAndDrive = async () => {
            // Check User
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
            if (user) loadSubmissions(user.id);

            // Check Drive
            try {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('drive_connected')) {
                    setIsDriveConnected(true);
                    window.history.replaceState({}, '', window.location.pathname);
                } else if (urlParams.get('error')) {
                    toast.error('Failed to connect Google Drive.');
                    window.history.replaceState({}, '', window.location.pathname);
                } else {
                    const res = await fetch('/api/auth/google/status');
                    const data = await res.json();
                    setIsDriveConnected(data.connected);
                }
            } catch (error) {
                console.error('Error checking drive status:', error);
                setIsDriveConnected(false);
            }
        };
        checkAuthAndDrive();
    }, []);

    // Initial Load - Subjects
    useEffect(() => {
        const loadSubjects = async () => {
            const data = await getSubjects();
            setSubjects(data);
        };
        loadSubjects();
    }, []);

    // Load Materials on Filter Change
    useEffect(() => {
        const timer = setTimeout(() => {
            loadMaterials();
        }, 300); // Debounce search

        // Load units if specific subject selected
        if (activeSubject !== 'all') {
            getUnits(activeSubject).then(setUnits).catch(console.error);
        } else {
            setUnits([]);
        }
        return () => clearTimeout(timer);
    }, [activeSubject, activeCategory, searchQuery]);

    const loadMaterials = async () => {
        setIsLoading(true);
        try {
            const data = await ClassroomMaterialService.getAll({
                subjectId: activeSubject,
                category: activeCategory,
                searchQuery: searchQuery || undefined
            });
            setMaterials(data);
        } catch (error) {
            console.error('Error loading materials:', error);
            toast.error('Failed to load materials');
        } finally {
            setIsLoading(false);
        }
    };

    const loadSubmissions = async (userId: string) => {
        try {
            const mySubs = await SubmissionService.getAllMySubmissions(userId);
            const map: Record<string, { status: string; id: string }> = {};
            mySubs.forEach(s => {
                map[s.material_id] = { status: s.status, id: s.id };
            });
            setMySubmissionsMap(map);
        } catch (error) {
            console.error('Failed to load submissions', error);
        }
    };

    const connectGoogleDrive = () => {
        window.location.href = '/api/auth/google';
    };

    // Handlers
    const handleEdit = (material: ClassroomMaterial) => {
        setEditingMaterial(material);
        setIsUploadModalOpen(true);
    };

    const handleDelete = async (materialId: string, driveFileId: string) => {
        if (!confirm('Are you sure you want to delete this material?')) return; // Keep native confirm for destructive action safety

        try {
            await fetch(`/api/classroom/delete?fileId=${driveFileId}`, { method: 'DELETE' });
            await ClassroomMaterialService.hardDelete(materialId);
            setMaterials(prev => prev.filter(m => m.id !== materialId));
            toast.success('Material deleted');
        } catch (error) {
            console.error('Error deleting material:', error);
            toast.error('Failed to delete material');
        }
    };

    const handlePreview = (material: ClassroomMaterial) => {
        setPreviewMaterial(material);
        setIsPreviewModalOpen(true);
    };

    const categories = [
        { value: 'all', label: 'All Categories', icon: Icons.LayoutGrid },
        { value: 'study_notes', label: 'Study Notes', icon: Icons.FileText },
        { value: 'assignments', label: 'Assignments', icon: Icons.CheckSquare },
        { value: 'announcements', label: 'Announcements', icon: Icons.Bell },
        { value: 'cia', label: 'CIAs', icon: Icons.BarChart3 },
        { value: 'other', label: 'Other', icon: Icons.FolderOpen },
    ];

    return (
        <WebAppShell>
            <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-[1800px] mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Resources</h1>
                        <p className="text-4xl font-black text-gray-900 tracking-tight">Classroom</p>
                        <p className="text-sm text-gray-500 mt-1">Upload and access study materials</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={`https://drive.google.com/drive/folders/${process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLASSROOM_FOLDER_ID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-4 bg-white text-gray-900 border border-gray-200 rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                        >
                            <Icons.ExternalLink size={18} />
                            <span>View Resources</span>
                        </a>
                        <button
                            onClick={() => {
                                setEditingMaterial(null);
                                setIsUploadModalOpen(true);
                            }}
                            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                            <Icons.Upload size={18} />
                            <span>Upload Material</span>
                        </button>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search materials by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[22px] text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-medium"
                        />
                        <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                            >
                                <Icons.X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Subject Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setActiveSubject('all')}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeSubject === 'all'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                All Subjects
                            </button>
                            {subjects.map((subject) => (
                                <button
                                    key={subject.id}
                                    onClick={() => setActiveSubject(subject.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeSubject === subject.id
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {subject.code}
                                </button>
                            ))}
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => setActiveCategory(cat.value)}
                                    className={`px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeCategory === cat.value
                                        ? 'bg-purple-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <cat.icon size={14} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Materials Grid */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-medium text-gray-500">Loading materials...</p>
                            </div>
                        </div>
                    ) : materials.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <Icons.FolderOpen className="mx-auto mb-4 text-gray-300" size={64} />
                                <p className="text-lg font-bold text-gray-400">No materials yet</p>
                                <p className="text-sm text-gray-400 mt-2">Click "Upload Material" to add contents</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                            {materials.map((material) => (
                                <MaterialCard
                                    key={material.id}
                                    material={material}
                                    subject={subjects.find(s => s.id === material.subject_id)}
                                    unit={units.find(u => u.id === material.unit_id)}
                                    currentUser={currentUser}
                                    submissionStatus={mySubmissionsMap[material.id]}
                                    onPreview={handlePreview}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={() => loadMaterials()}
                subjects={subjects}
                editingMaterial={editingMaterial}
                isDriveConnected={isDriveConnected}
                currentUser={currentUser}
                connectGoogleDrive={connectGoogleDrive}
            />

            {previewMaterial && (
                <PreviewModal
                    isOpen={isPreviewModalOpen}
                    onClose={() => setIsPreviewModalOpen(false)}
                    material={previewMaterial}
                    currentUser={currentUser}
                    subjects={subjects}
                    onSubmissionChange={() => {
                        if (currentUser) loadSubmissions(currentUser.id);
                    }}
                />
            )}
        </WebAppShell>
    );
}
