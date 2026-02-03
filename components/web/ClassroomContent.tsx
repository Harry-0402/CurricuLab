"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { getSubjects, getUnits } from '@/lib/services/app.service';
import { ClassroomMaterialService, ClassroomMaterial } from '@/lib/services/classroom-material-service';
import { SubmissionService, CommentService, Submission, MaterialComment } from '@/lib/services/submission-service';
import { GoogleDriveService } from '@/lib/services/google-drive-service';
import { Subject, Unit } from '@/types';
import { supabase } from '@/utils/supabase/client';

export function ClassroomContent() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<ClassroomMaterial | null>(null);
    const [activeSubject, setActiveSubject] = useState('all');
    const [activeCategory, setActiveCategory] = useState('all');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [materials, setMaterials] = useState<ClassroomMaterial[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingMaterial, setEditingMaterial] = useState<ClassroomMaterial | null>(null);
    const [previewMaterial, setPreviewMaterial] = useState<ClassroomMaterial | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [comments, setComments] = useState<MaterialComment[]>([]);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [submissionFile, setSubmissionFile] = useState<File | null>(null);
    const [submissionText, setSubmissionText] = useState('');
    const [commentText, setCommentText] = useState('');
    const [mySubmission, setMySubmission] = useState<Submission | null>(null);
    const [formData, setFormData] = useState({
        subject: '',
        unit: '',
        title: '',
        description: '',
        textContent: '',
        dueDate: '',
        category: '' as 'study_notes' | 'assignments' | 'announcements' | 'cia' | 'other' | '',
    });
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isDriveConnected, setIsDriveConnected] = useState<boolean | null>(null);

    // Check Drive connection
    useEffect(() => {
        const checkDriveStatus = async () => {
            try {
                // Check for connection success param
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('drive_connected')) {
                    setIsDriveConnected(true);
                    window.history.replaceState({}, '', window.location.pathname);
                    return;
                }

                if (urlParams.get('error')) {
                    alert('Failed to connect Google Drive. Please try again.');
                    window.history.replaceState({}, '', window.location.pathname);
                }

                const res = await fetch('/api/auth/google/status');
                const data = await res.json();
                setIsDriveConnected(data.connected);
            } catch (error) {
                console.error('Error checking drive status:', error);
                setIsDriveConnected(false);
            }
        };
        checkDriveStatus();
    }, []);

    const connectGoogleDrive = () => {
        window.location.href = '/api/auth/google';
    };

    // Get current user
    const [mySubmissionsMap, setMySubmissionsMap] = useState<Record<string, { status: string; id: string }>>({});

    useEffect(() => {
        const getCurrentUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (user) {
                // Fetch my submissions for dashboard badges
                const mySubs = await SubmissionService.getAllMySubmissions(user.id);
                const map: Record<string, { status: string; id: string }> = {};
                mySubs.forEach(s => {
                    map[s.material_id] = { status: s.status, id: s.id };
                });
                setMySubmissionsMap(map);
            }
        };
        getCurrentUser();
    }, []);

    // Load subjects and materials
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const subjects = await getSubjects();
                setSubjects(subjects);

                setIsLoading(true);
                const materialsData = await ClassroomMaterialService.getAll();
                setMaterials(materialsData);
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Load units when subject changes in form
    useEffect(() => {
        const loadUnits = async () => {
            if (formData.subject) {
                const data = await getUnits(formData.subject);
                setUnits(data);
            }
        };
        loadUnits();
    }, [formData.subject]);

    // Filter materials
    const filteredMaterials = materials.filter(material => {
        const subjectMatch = activeSubject === 'all' || material.subject_id === activeSubject;
        const categoryMatch = activeCategory === 'all' || material.material_category === activeCategory;
        return subjectMatch && categoryMatch;
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Auto-detect file type
            const extension = file.name.split('.').pop()?.toLowerCase();
            let detectedType: 'pdf' | 'doc' | 'ppt' | 'video' | 'image' | 'other' = 'other';

            if (extension === 'pdf') detectedType = 'pdf';
            else if (['doc', 'docx'].includes(extension || '')) detectedType = 'doc';
            else if (['ppt', 'pptx'].includes(extension || '')) detectedType = 'ppt';
            else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) detectedType = 'video';
            else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) detectedType = 'image';

            // Auto-set title if empty
            if (!formData.title) {
                setFormData(prev => ({ ...prev, title: file.name }));
            }
        }
    };

    const resetForm = () => {
        setFormData({ subject: '', unit: '', title: '', description: '', textContent: '', dueDate: '', category: '' });
        setSelectedFile(null);
        setEditingMaterial(null);
    };

    const handleUpload = async () => {

        if (!formData.subject) {
            alert('Please select a subject');
            return;
        }

        if (!formData.category) {
            alert('Please select a material category');
            return;
        }

        if (!formData.title) {
            alert('Please enter a title');
            return;
        }

        // For announcements/other without files, text content is required
        if (!selectedFile && (formData.category === 'announcements' || formData.category === 'other')) {
            if (!formData.textContent || formData.textContent.trim() === '') {
                alert('Please provide text content or upload a file for announcements');
                return;
            }
        }

        // For other materials without files, ensure we have content
        if (!selectedFile && !formData.textContent) {
            alert('Please either upload a file or provide text content');
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);

        try {
            // If editing, handle update
            if (editingMaterial) {
                setUploadProgress(50);

                const updatedMaterial = await ClassroomMaterialService.update(editingMaterial.id, {
                    subject_id: formData.subject,
                    unit_id: formData.unit || undefined,
                    title: formData.title,
                    description: formData.description || undefined,
                    text_content: formData.textContent || undefined,
                    due_date: formData.dueDate || undefined,
                    material_category: formData.category as 'study_notes' | 'assignments' | 'announcements' | 'cia' | 'other',
                });

                if (updatedMaterial) {
                    setMaterials(prev => prev.map(m => m.id === editingMaterial.id ? updatedMaterial : m));
                    setIsUploadModalOpen(false);
                    resetForm();
                    setEditingMaterial(null);
                    alert('Material updated successfully!');
                }
                return;
            }

            let driveData = null;

            // Step 1: Upload to Google Drive (if file is provided)
            if (selectedFile) {
                const formDataToSend = new FormData();
                formDataToSend.append('file', selectedFile);
                formDataToSend.append('metadata', JSON.stringify({
                    subjectId: formData.subject,
                    subjectTitle: subjects.find(s => s.id === formData.subject)?.title || '',
                    unitId: formData.unit,
                    unitTitle: units.find(u => u.id === formData.unit)?.title || '',
                    category: formData.category, // Pass category for folder organization
                    title: formData.title,
                    description: formData.description,
                }));

                setUploadProgress(30);

                const uploadResponse = await fetch('/api/classroom/upload', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error || 'Failed to upload file');
                }

                driveData = await uploadResponse.json();
                setUploadProgress(70);
            } else {
                setUploadProgress(50);
            }

            // Step 2: Save metadata to database
            const material = await ClassroomMaterialService.create({
                subject_id: formData.subject,
                unit_id: formData.unit || undefined,
                title: formData.title,
                description: formData.description || undefined,
                text_content: formData.textContent || undefined,
                due_date: formData.dueDate || undefined,
                google_drive_file_id: driveData?.id || '',
                google_drive_link: driveData?.webViewLink || '',
                file_name: selectedFile?.name || undefined,
                file_size_bytes: driveData ? parseInt(driveData.size) : undefined,
                mime_type: selectedFile?.type || undefined,
                material_category: formData.category as 'study_notes' | 'assignments' | 'announcements' | 'cia' | 'other',
                uploaded_by: currentUser?.id || undefined,
                uploader_name: currentUser?.user_metadata?.name || currentUser?.email || 'Unknown',
            });

            setUploadProgress(100);

            if (material) {
                // Add to materials list
                setMaterials(prev => [material, ...prev]);
                setIsUploadModalOpen(false);
                resetForm();
                alert(selectedFile ? 'Material uploaded successfully!' : 'Material created successfully!');
            }
        } catch (error: any) {
            console.error('Error uploading material:', error);
            alert(`Failed to upload material: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };



    const handleEdit = (material: ClassroomMaterial) => {
        setEditingMaterial(material);
        setFormData({
            subject: material.subject_id,
            unit: material.unit_id || '',
            title: material.title,
            description: material.description || '',
            textContent: material.text_content || '',
            dueDate: material.due_date || '',
            category: material.material_category,
        });
        setIsUploadModalOpen(true);
    };

    const handleDelete = async (materialId: string, driveFileId: string) => {
        if (!confirm('Are you sure you want to delete this material? This will remove it from both the database and Google Drive.')) {
            return;
        }

        try {
            // Delete from Google Drive
            await fetch(`/api/classroom/delete?fileId=${driveFileId}`, { method: 'DELETE' });

            // Delete from database
            await ClassroomMaterialService.hardDelete(materialId);

            // Remove from UI
            setMaterials(prev => prev.filter(m => m.id !== materialId));
        } catch (error) {
            console.error('Error deleting material:', error);
            alert('Failed to delete material');
        }
    };

    const handlePreview = async (material: ClassroomMaterial) => {
        setPreviewMaterial(material);

        // Load comments
        const materialComments = await CommentService.getByMaterial(material.id);
        setComments(materialComments);

        // For assignments/CIAs, load submissions
        if (material.material_category === 'assignments' || material.material_category === 'cia') {
            const allSubmissions = await SubmissionService.getByMaterial(material.id);
            setSubmissions(allSubmissions);

            // Load my submission if exists
            if (currentUser) {
                const mySubmit = await SubmissionService.getByStudent(material.id, currentUser.id);
                setMySubmission(mySubmit);
            }
        }
        setIsPreviewModalOpen(true);
    };

    const handleSubmitWork = async () => {
        if (!previewMaterial || !currentUser) return;

        if (!submissionFile && !submissionText.trim()) {
            alert('Please upload a file or enter submission text');
            return;
        }

        setIsUploading(true);
        try {
            let driveData = null;

            if (submissionFile) {
                const formDataToSend = new FormData();
                formDataToSend.append('file', submissionFile);
                formDataToSend.append('metadata', JSON.stringify({
                    subjectId: previewMaterial.subject_id,
                    subjectTitle: subjects.find(s => s.id === previewMaterial.subject_id)?.title || 'Unknown Subject',
                    type: 'submission',
                    title: submissionFile.name, // Use actual filename for the file title
                    assignmentTitle: previewMaterial.title,
                    studentName: currentUser.user_metadata?.name || currentUser.email || 'Unknown Student',
                }));

                const uploadResponse = await fetch('/api/classroom/upload', {
                    method: 'POST',
                    body: formDataToSend,
                });
                driveData = await uploadResponse.json();
            }

            const submission = await SubmissionService.create({
                material_id: previewMaterial.id,
                student_id: currentUser.id,
                student_name: currentUser.user_metadata?.name || currentUser.email,
                google_drive_file_id: driveData?.id || '',
                google_drive_link: driveData?.webViewLink || '',
                submission_text: submissionText || undefined,
                file_name: submissionFile?.name || undefined,
                file_size_bytes: driveData ? parseInt(driveData.size) : undefined,
                mime_type: submissionFile?.type || undefined,
            });

            if (submission) {
                setMySubmission(submission);
                setSubmissions(prev => [submission, ...prev]);
                setIsSubmissionModalOpen(false);
                setSubmissionFile(null);
                setSubmissionText('');
                alert('Submission successful!');
            }
        } catch (error) {
            console.error('Error submitting:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handlePostComment = async () => {
        if (!previewMaterial || !currentUser || !commentText.trim()) return;

        try {
            const comment = await CommentService.create({
                material_id: previewMaterial.id,
                user_id: currentUser.id,
                user_name: currentUser.user_metadata?.name || currentUser.email || 'Anonymous',
                comment_text: commentText,
            });

            if (comment) {
                setComments(prev => [...prev, comment]);
                setCommentText('');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Delete this comment?')) return;

        const success = await CommentService.delete(commentId);
        if (success) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    };

    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case 'pdf': return <Icons.FileText className="text-red-600" size={24} />;
            case 'doc': return <Icons.FileText className="text-blue-600" size={24} />;
            case 'ppt': return <Icons.FileText className="text-orange-600" size={24} />;
            case 'video': return <Icons.Video className="text-purple-600" size={24} />;
            case 'image': return <Icons.Image className="text-green-600" size={24} />;
            default: return <Icons.File className="text-gray-600" size={24} />;
        }
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
                            href="https://drive.google.com/drive/u/0/folders/1gFFHW_E0kCMtaqodDHvYEP8vTGucKYff"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-4 bg-white text-gray-900 border border-gray-200 rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                        >
                            <Icons.ExternalLink size={18} />
                            <span>View Resources</span>
                        </a>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                            <Icons.Upload size={18} />
                            <span>Upload Material</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
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

                {/* Materials Grid */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-medium text-gray-500">Loading materials...</p>
                            </div>
                        </div>
                    ) : filteredMaterials.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <Icons.FolderOpen className="mx-auto mb-4 text-gray-300" size={64} />
                                <p className="text-lg font-bold text-gray-400">No materials yet</p>
                                <p className="text-sm text-gray-400 mt-2">Click "Upload Material" to add study materials</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredMaterials.map((material) => {
                                const subject = subjects.find(s => s.id === material.subject_id);
                                const unit = units.find(u => u.id === material.unit_id);
                                return (
                                    <div
                                        key={material.id}
                                        onClick={() => handlePreview(material)}
                                        className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                                {getFileIcon(material.file_type)}
                                            </div>
                                            <div className="flex gap-1">
                                                {/* Edit Button - Always Visible */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(material);
                                                    }}
                                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/edit"
                                                    title="Edit material"
                                                >
                                                    <Icons.Edit className="w-4 h-4 text-gray-400 group-hover/edit:text-blue-600" />
                                                </button>
                                                {/* Delete Button - Only for owner */}
                                                {currentUser?.id === material.uploaded_by && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(material.id, material.google_drive_file_id);
                                                        }}
                                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group/delete"
                                                        title="Delete material"
                                                    >
                                                        <Icons.Trash2 className="w-4 h-4 text-gray-400 group-hover/delete:text-red-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{material.title}</h3>
                                        {material.description && (
                                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{material.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                                                {subject?.code || 'Unknown'}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-md ${material.material_category === 'study_notes' ? 'bg-green-50 text-green-700' :
                                                material.material_category === 'assignments' ? 'bg-orange-50 text-orange-700' :
                                                    material.material_category === 'announcements' ? 'bg-purple-50 text-purple-700' :
                                                        material.material_category === 'cia' ? 'bg-red-50 text-red-700' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>
                                                {material.material_category === 'study_notes' ? '📚 Study Notes' :
                                                    material.material_category === 'assignments' ? '✅ Assignments' :
                                                        material.material_category === 'announcements' ? '📢 Announcements' :
                                                            material.material_category === 'cia' ? '📊 CIAs' :
                                                                '📁 Other'}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        {(material.material_category === 'assignments' || material.material_category === 'cia') && (
                                            <div className="mb-2">
                                                {mySubmissionsMap[material.id] ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                                                        <Icons.CheckCircle size={12} className="fill-current" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Submitted</span>
                                                    </div>
                                                ) : material.due_date && new Date(material.due_date) < new Date() ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                                                        <Icons.AlertCircle size={12} />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Overdue</span>
                                                    </div>
                                                ) : material.due_date ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                                                        <Icons.Clock size={12} />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{material.uploader_name || 'Unknown'}</span>
                                            {material.due_date && (material.material_category === 'assignments' || material.material_category === 'cia') ? (
                                                <span className="flex items-center gap-1 text-red-600 font-bold">
                                                    📅 Due: {new Date(material.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            ) : (
                                                <span>{new Date(material.created_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                {editingMaterial ? 'Edit Material' : 'Upload Material'}
                            </h2>
                            <button
                                onClick={() => { setIsUploadModalOpen(false); resetForm(); }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Icons.X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            {/* Connect Google Drive Warning & Button */}
                            {isDriveConnected === false && (
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                            <Icons.AlertCircle size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-orange-800">Google Drive Not Connected</h3>
                                            <p className="text-xs text-orange-600 mt-1 mb-3">
                                                You need to connect your Google Drive to upload files.
                                                This ensures you own your files and have unlimited storage.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={connectGoogleDrive}
                                                className="px-4 py-2 bg-white border border-orange-200 text-orange-700 text-xs font-bold rounded-lg shadow-sm hover:bg-orange-50 transition-colors flex items-center gap-2"
                                            >
                                                <Icons.ExternalLink size={14} />
                                                Connect Google Drive
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={isDriveConnected === false ? 'opacity-50 pointer-events-none filter blur-[1px] select-none' : ''}>
                                {/* File Upload Area */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">File (Optional)</label>
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-center group"
                                    >
                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Icons.Upload size={20} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-700">
                                            {selectedFile ? selectedFile.name : 'Click to select file'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Optional - Add files or create text-only materials
                                        </p>
                                    </label>
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter material title"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Subject *</label>
                                        <div className="relative">
                                            <select
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value, unit: '' })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                            >
                                                <option value="">Select Subject...</option>
                                                {subjects.map(s => (
                                                    <option key={s.id} value={s.id}>{s.code} - {s.title}</option>
                                                ))}
                                            </select>
                                            <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    {/* Unit */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Unit (Optional)</label>
                                        <div className="relative">
                                            <select
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                disabled={!formData.subject}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium disabled:opacity-50"
                                            >
                                                <option value="">Select Unit...</option>
                                                {units.map(u => (
                                                    <option key={u.id} value={u.id}>Unit {u.order}: {u.title}</option>
                                                ))}
                                            </select>
                                            <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Material Category *</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                        >
                                            <option value="">Select Category...</option>
                                            <option value="study_notes">📚 Study Notes</option>
                                            <option value="assignments">✅ Assignments</option>
                                            <option value="announcements">📢 Announcements</option>
                                            <option value="cia">📊 CIAs</option>
                                            <option value="other">📁 Other Material</option>
                                        </select>
                                        <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description (Optional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the material"
                                        rows={1}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-none"
                                    />
                                </div>

                                {/* Text Content - Show for announcements and text-based materials */}
                                {(formData.category === 'announcements' || formData.category === 'other') && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                            📝 Full Content {!selectedFile && '*'}
                                        </label>
                                        <textarea
                                            value={formData.textContent}
                                            onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                                            placeholder="Enter the full announcement or text content here...&#10;&#10;You can write multiple paragraphs, lists, and detailed information."
                                            rows={6}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-y"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            💡 Add detailed text content for announcements or information without files
                                        </p>
                                    </div>
                                )}

                                {/* Due Date - Show for assignments and CIAs */}
                                {(formData.category === 'assignments' || formData.category === 'cia') && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                            📅 Due Date (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            ⏰ Optional: Add a deadline for this {formData.category === 'cia' ? 'CIA' : 'assignment'}
                                        </p>
                                    </div>
                                )}

                                {/* Progress Bar */}
                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-2 transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-center">Uploading... {uploadProgress}%</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleUpload}
                                    type="button"
                                    disabled={!formData.subject || !formData.title || isUploading}
                                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Icons.Loader2 size={20} className="animate-spin" />
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <span>{editingMaterial ? 'Update Material' : (selectedFile ? 'Upload Material' : 'Create Material')}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {isPreviewModalOpen && selectedMaterial && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900">{selectedMaterial.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{selectedMaterial.description || 'No description'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(selectedMaterial.google_drive_link, '_blank')}
                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Open in Google Drive"
                                >
                                    <Icons.ExternalLink className="text-gray-600" size={20} />
                                </button>
                                <button
                                    onClick={() => setIsPreviewModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Close"
                                >
                                    <Icons.X className="text-gray-600" size={20} />
                                </button>
                            </div>
                        </div>

                        {/* iframe Content */}
                        <div className="flex-1 relative bg-gray-50">
                            <iframe
                                src={selectedMaterial.google_drive_link}
                                className="w-full h-full border-0"
                                title="Material Preview"
                                allow="autoplay"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {isPreviewModalOpen && previewMaterial && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">{previewMaterial.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{subjects.find(s => s.id === previewMaterial.subject_id)?.title}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsPreviewModalOpen(false);
                                    setPreviewMaterial(null);
                                    setComments([]);
                                    setSubmissions([]);
                                    setMySubmission(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Icons.X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* File/Content Viewer */}
                            {previewMaterial.google_drive_file_id ? (
                                <div className="space-y-4">
                                    {/* Preview Container */}
                                    <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video relative group">
                                        <iframe
                                            src={previewMaterial.google_drive_link.replace(/\/view.*$|\/edit.*$/, '/preview')}
                                            className="w-full h-full border-0"
                                            title="Material Preview"
                                            allow="autoplay"
                                        />

                                        {/* Overlay Button */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={previewMaterial.google_drive_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-white text-gray-900 rounded-lg shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50"
                                            >
                                                <Icons.ExternalLink size={16} />
                                                Open in Drive
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : previewMaterial.text_content ? (
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="prose prose-sm max-w-none">
                                        <p className="whitespace-pre-wrap text-gray-700">{previewMaterial.text_content}</p>
                                    </div>
                                </div>
                            ) : null}

                            {/* Submission Section for Assignments/CIAs */}
                            {(previewMaterial.material_category === 'assignments' || previewMaterial.material_category === 'cia') && currentUser && (
                                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">📤 Your Submission</h3>
                                        {mySubmission ? (
                                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                                ✓ Submitted
                                            </span>
                                        ) : previewMaterial.due_date && new Date(previewMaterial.due_date) < new Date() ? (
                                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                                ⚠ Overdue
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                                                ⏳ Pending
                                            </span>
                                        )}
                                    </div>

                                    {mySubmission ? (
                                        <div className="bg-white rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Icons.CheckCircle className="text-green-600" size={20} />
                                                        <span className="font-bold text-gray-900">Submitted {new Date(mySubmission.submitted_at).toLocaleDateString()}</span>
                                                    </div>
                                                    {mySubmission.google_drive_link && (
                                                        <a
                                                            href={mySubmission.google_drive_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm flex items-center gap-2 mb-2"
                                                        >
                                                            <Icons.File size={16} />
                                                            {mySubmission.file_name || 'View submission'}
                                                        </a>
                                                    )}
                                                    {mySubmission.submission_text && (
                                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{mySubmission.submission_text}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Are you sure you want to delete your submission?')) {
                                                            const success = await SubmissionService.delete(mySubmission.id);
                                                            if (success) {
                                                                setMySubmission(null);
                                                                setSubmissions(prev => prev.filter(s => s.id !== mySubmission.id));
                                                            } else {
                                                                alert('Failed to delete submission');
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete submission"
                                                >
                                                    <Icons.Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsSubmissionModalOpen(true)}
                                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                                        >
                                            Submit your work
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Comments Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">💬 Comments ({comments.length})</h3>

                                {/* Comment Input */}
                                <div className="mb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                            placeholder="Add a comment..."
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                        <button
                                            onClick={handlePostComment}
                                            disabled={!commentText.trim()}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-3">
                                    {comments.length === 0 ? (
                                        <p className="text-center text-gray-400 py-8">No comments yet. Be the first to comment!</p>
                                    ) : (
                                        comments.map(comment => (
                                            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-gray-900">{comment.user_name}</span>
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700">{comment.comment_text}</p>
                                                    </div>
                                                    {currentUser && comment.user_id === currentUser.id && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="p-1 hover:bg-red-100 rounded transition-colors"
                                                            title="Delete comment"
                                                        >
                                                            <Icons.Trash2 className="text-gray-400 hover:text-red-600" size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Modal */}
            {isSubmissionModalOpen && previewMaterial && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-2xl font-black text-gray-900">Submit Your Work</h2>
                            <button
                                onClick={() => {
                                    setIsSubmissionModalOpen(false);
                                    setSubmissionFile(null);
                                    setSubmissionText('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Icons.X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">File (Optional)</label>
                                <input
                                    type="file"
                                    onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="submission-file-upload"
                                />
                                <label
                                    htmlFor="submission-file-upload"
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-center group"
                                >
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Icons.Upload size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                        {submissionFile ? submissionFile.name : 'Click to select file'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Upload your assignment file
                                    </p>
                                </label>
                            </div>

                            {/* Text Submission */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Or Enter Text Submission</label>
                                <textarea
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    placeholder="Type your answer or submission here..."
                                    rows={6}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-y"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitWork}
                                disabled={(!submissionFile && !submissionText.trim()) || isUploading}
                                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <Icons.Loader2 size={20} className="animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icons.CheckCircle size={20} />
                                        <span>Submit Assignment</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </WebAppShell>
    );
}
