"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Subject, Unit, VaultResource, VaultResourceType } from '@/types';
import { getSubjects, getVaultResources, createVaultResource, updateVaultResource, deleteVaultResource } from '@/lib/services/app.service';
import { AiService } from '@/lib/services/ai-service';
import { toast } from 'sonner';

import { SubjectService } from '@/lib/data/subject-service';
import { UnitService } from '@/lib/data/unit-service';
import { useSemester } from '@/components/providers/SemesterProvider';
import { useAuth } from '@/components/providers/AuthProvider';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
const TYPE_CONFIG: Record<VaultResourceType, { label: string; icon: any; color: string; bgColor: string }> = {
    study_note: { label: 'Study Note', icon: Icons.FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    question_bank: { label: 'Question Bank', icon: Icons.CheckSquare, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    case_study: { label: 'Case Study', icon: Icons.Briefcase, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    project: { label: 'Project', icon: Icons.FolderKanban, color: 'text-green-600', bgColor: 'bg-green-50' },
    revision_note: { label: 'Revision Note', icon: Icons.PenLine, color: 'text-rose-600', bgColor: 'bg-rose-50' },
    youtube_video: { label: 'YouTube Video', icon: Icons.Youtube, color: 'text-red-600', bgColor: 'bg-red-50' },
    flashcard: { label: 'Flashcard', icon: Icons.Layers, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    other_resources: { label: 'Other Resources', icon: Icons.Link, color: 'text-orange-600', bgColor: 'bg-orange-50' }
};

const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            return url;
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (e) {
        return url;
    }
};

export function VaultContent() {
    const { activeSemesterId } = useSemester();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string>('');
    const [resources, setResources] = useState<VaultResource[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedResource, setSelectedResource] = useState<VaultResource | null>(null);
    const [selectedType, setSelectedType] = useState<VaultResourceType | 'all'>('all');
    const [selectedUnitId, setSelectedUnitId] = useState<string>('all');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        subjectId: '',
        unitId: '',
        type: 'study_note' as VaultResourceType,
        title: '',
        link: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    
    // Auth State
    const { isAdmin, sessionToken } = useAuth();

    // Delete confirmation state
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // State for HTML rendering workaround
    const [htmlContent, setHtmlContent] = useState<string | null>(null);

    // State for prompt copy feedback
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Fetch HTML content if it's a Supabase HTML file
    useEffect(() => {
        if (selectedResource?.link && selectedResource.link.includes('/storage/v1/object/public/vault/') && selectedResource.link.endsWith('.html')) {
            fetch(selectedResource.link)
                .then(res => res.text())
                .then(text => setHtmlContent(text))
                .catch(console.error);
        } else {
            setHtmlContent(null);
        }
    }, [selectedResource]);

    const [showExportMenu, setShowExportMenu] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (!activeSemesterId) return;

        let ignore = false;
        const loadInitialData = async () => {
            setLoading(true);

            // Note: Admin status and session token are now securely loaded by the onAuthStateChange listener 
            // completely bypassing the buggy getSession() lock that was causing Infinite Loading hangs here!
            const fetchedSubjects = await SubjectService.getAll(activeSemesterId);
            
            if (ignore) return;
            
            setSubjects(fetchedSubjects);

            // Set the activeSubjectId which will trigger the resource load via the secondary useEffect hook exactly once
            if (fetchedSubjects.length > 0) {
                const firstSubjectId = fetchedSubjects[0].id;
                setActiveSubjectId(firstSubjectId);
            } else {
                setActiveSubjectId('');
                setResources([]);
                setLoading(false);
            }
            setIsInitialLoad(false);
        };
        loadInitialData();
        return () => { ignore = true; };
    }, [activeSemesterId]);

    useEffect(() => {
        let ignore = false;
        const loadResources = async () => {
            // Skip the very first render (wait until initial load sets subjects and isInitialLoad to false)
            if (isInitialLoad || !activeSubjectId) return;

            setLoading(true);
            const activeSub = subjects.find(s => s.id === activeSubjectId);
            // Only filter by subject on server side - type and unit filtering done client-side
            const [data, fetchedUnits] = await Promise.all([
                getVaultResources({ subjectId: activeSubjectId }),
                UnitService.getBySubjectId(activeSubjectId, activeSub?.code)
            ]);
            
            if (ignore) return;
            
            setResources(data);
            setUnits(fetchedUnits);
            setLoading(false);
        };
        loadResources();
        return () => { ignore = true; };
    }, [activeSubjectId, isInitialLoad, subjects]);



    const activeSubject = subjects.find(s => s.id === activeSubjectId);

    const handleOpenAddModal = () => {
        setEditingId(null);
        setFormData({
            subjectId: activeSubjectId,
            unitId: '',
            // Default to selected tab type, or 'study_note' if 'all' is selected
            type: selectedType !== 'all' ? selectedType : 'study_note',
            title: '',
            link: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (e: React.MouseEvent, resource: VaultResource) => {
        e.stopPropagation();
        setEditingId(resource.id);
        setFormData({
            subjectId: resource.subjectId || '',
            unitId: resource.unitId || '',
            type: resource.type || 'study_note',
            title: resource.title || '',
            link: resource.link || ''
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.subjectId || !formData.title || !formData.link) return;

        setIsSaving(true);
        try {
            let saved: VaultResource | null = null;
            let finalLink = formData.link;

            const resourceData = {
                subjectId: formData.subjectId,
                unitId: formData.unitId,
                type: formData.type,
                title: formData.title,
                link: finalLink,
                tags: selectedResource?.tags || []
            };

            if (editingId) {
                saved = await updateVaultResource({
                    id: editingId,
                    ...resourceData
                }, sessionToken);
            } else {
                saved = await createVaultResource(resourceData, sessionToken);
            }

            if (saved) {
                toast.success(editingId ? 'Resource updated successfully!' : 'Resource added successfully!');
                setIsModalOpen(false);

                // Optimistic UI update - add/update locally instead of refetching all
                if (editingId) {
                    setResources(prev => prev.map(r => r.id === editingId ? saved! : r));
                    if (selectedResource?.id === editingId) {
                        setSelectedResource(saved);
                    }
                } else {
                    // Add new resource to the beginning of the list
                    setResources(prev => [saved!, ...prev]);

                    // Trigger push notification to class students
                    fetch('/api/push/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: 'New Vault Resource',
                            message: `A new ${formData.type.replace('_', ' ')} "${formData.title}" has been added!`,
                            url: '/vault',
                            targetSemesterId: activeSemesterId
                        })
                    }).catch(console.error);
                }
            }
        } catch (error: any) {
            console.error("Save error:", error);
            toast.error("An unexpected error occurred. Please check the file and try again.");
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

        const success = await deleteVaultResource(deleteConfirmId, sessionToken);
        if (success) {
            setResources(prev => prev.filter(r => r.id !== deleteConfirmId));
            if (selectedResource?.id === deleteConfirmId) {
                setSelectedResource(null);
            }
            toast.info('Resource deleted');
        }
        setDeleteConfirmId(null);
    };

    const handleCopyPrompt = (e: React.MouseEvent, resource: VaultResource) => {
        e.stopPropagation();
        if (!resource.link) {
            toast.error("No link available for this resource to generate a prompt.");
            return;
        }

        const subject = subjects.find(s => s.id === resource.subjectId);
        const subjectLabel = subject ? `${subject.title}${subject.code ? ` (${subject.code})` : ''}` : '';
        const typeLabel = TYPE_CONFIG[resource.type]?.label || 'resource';

        const orderNum = resource.unitId ? parseInt(resource.unitId.replace('unit-', ''), 10) : null;
        const matchingUnit = orderNum ? units.find(u => u.order === orderNum) : undefined;

        let unitContext = '';
        if (matchingUnit) {
            const syllabusList = matchingUnit.topics && matchingUnit.topics.length > 0
                ? `\n- Syllabus Topics:\n${matchingUnit.topics.map(t => `  * ${t}`).join('\n')}`
                : '';
            
            unitContext = `

UNIT SYLLABUS CONTEXT:
- Unit: ${matchingUnit.title}
- Description: ${matchingUnit.description}${syllabusList}
--------------------------------------------------`;
        }

        const prompt = `You are an expert academic tutor. I want you to act as my study assistant and explain the material in the following resource.

--------------------------------------------------
RESOURCE DETAILS:
- Subject: ${subjectLabel}
- Title: "${resource.title}"
- Type: ${typeLabel}
- URL: ${resource.link}
--------------------------------------------------${unitContext}

INSTRUCTIONS FOR THE STUDY GUIDE:
Please review the document at the URL provided above and generate a highly detailed, comprehensive study guide that elaborates on the content. Your explanation must:

1. Align with the syllabus/topics specified for the unit (if provided above).
2. Identify and explain every core concept in depth, defining technical terms and key ideas clearly.
3. Go through each main point presented in the document, explaining the logic, theory, and background details.
4. Break down and expand on all sub-points, providing additional explanations, context, and practical examples where helpful.
5. Structure the output clearly with hierarchical headings (Markdown format), bullet points, and clean spacing to optimize it for reading and learning.`;

        navigator.clipboard.writeText(prompt)
            .then(() => {
                setCopiedId(resource.id);
                toast.success("AI Prompt copied to clipboard!");
                setTimeout(() => setCopiedId(null), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy prompt:", err);
                toast.error("Failed to copy prompt to clipboard. Please try again.");
            });
    };


    const handleExportWord = async () => {
        if (!activeSubjectId) return;
        const sub = subjects.find(s => s.id === activeSubjectId);
        const { PlatformExportService } = await import('@/lib/services/export-service');
        await PlatformExportService.generateVaultExport(
            sub?.title || "Knowledge Vault",
            resources
        );
        setShowExportMenu(false);
    };

    const handleExportHTML = async () => {
        if (!activeSubjectId) return;
        const sub = subjects.find(s => s.id === activeSubjectId);
        const { PlatformExportService } = await import('@/lib/services/export-service');
        await PlatformExportService.generateVaultHTMLExport(
            sub?.title || "Knowledge Vault",
            resources
        );
        setShowExportMenu(false);
    };

    // Client-side filtering for better performance (no DB reload on type/unit changes)
    const filteredResources = resources
        .filter(r => r.type in TYPE_CONFIG)
        .filter(r => selectedType === 'all' || r.type === selectedType)
        .filter(r => selectedUnitId === 'all' || r.unitId === selectedUnitId);


    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-[1800px] mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Library</h1>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">Knowledge Vault</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative print:hidden">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-6 py-4 rounded-[22px] transition-all border border-gray-100 shadow-sm"
                        >
                            <Icons.Download size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Export</span>
                            <Icons.ChevronDown size={14} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={handleExportWord}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Icons.FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Word Document</p>
                                        <p className="text-[10px] font-medium text-gray-500">Editable .docx file</p>
                                    </div>
                                </button>
                                <button
                                    onClick={handleExportHTML}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-amber-50 rounded-xl transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                        <Icons.Globe size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Web Page</p>
                                        <p className="text-[10px] font-medium text-gray-500">Standalone .html file</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 ml-auto"
                    >
                        <Icons.Plus size={18} />
                        Add Resource
                    </button>
                </div>
            </div>

            {/* Subject Switcher */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
                {subjects.map((subject) => {
                    const isActive = activeSubjectId === subject.id;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => { setActiveSubjectId(subject.id); setSelectedResource(null); }}
                            title={subject.title}
                            className={cn(
                                "px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1.5 border shadow-sm text-xs font-bold",
                                isActive
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                                    : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                            )}
                        >
                            <span className="tracking-wide uppercase">
                                {subject.code || subject.title.substring(0, 3)}
                            </span>
                            {isActive && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Filter Row */}
            <div className="flex items-center justify-between gap-4 shrink-0 print:hidden w-full overflow-hidden">
                {/* Type Filter Badges */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={cn(
                            "px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all border",
                            selectedType === 'all'
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                        )}
                    >
                        All
                    </button>
                    {(['study_note', 'question_bank', 'case_study', 'project', 'revision_note', 'youtube_video', 'flashcard', 'other_resources'] as VaultResourceType[]).map(type => {
                        const config = TYPE_CONFIG[type];
                        const isActive = selectedType === type;
                        return (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={cn(
                                    "px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all border flex items-center gap-1.5",
                                    isActive
                                        ? `${config.bgColor} ${config.color} border-current`
                                        : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                                )}
                            >
                                <config.icon size={13} />
                                {config.label}s
                            </button>
                        );
                    })}
                </div>

            </div>

            <div className="text-[11px] font-medium text-purple-600 bg-purple-50/50 border border-purple-100/50 p-3.5 rounded-2xl flex items-start gap-2 leading-relaxed shrink-0">
                <Icons.Info size={14} className="shrink-0 mt-0.5 text-purple-500" />
                <span>
                    <strong>How to use:</strong> Click the <strong>"AI Prompt"</strong> button on any card to copy a structured prompt containing the document link and unit syllabus details. Paste it into your preferred AI (ChatGPT, Gemini, or Claude) to generate a detailed study guide.
                </span>
            </div>

            {/* Main Content - Grid Layout */}
            <div className="flex-1 overflow-y-auto min-h-0 print:hidden scrollbar-hide">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-gray-500">Loading resources...</p>
                        </div>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Icons.FileText className="mx-auto mb-4 text-gray-300" size={64} />
                            <p className="text-lg font-bold text-gray-400">No resources yet</p>
                            <p className="text-sm text-gray-400 mt-2">Click "Add Resource" to get started</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                        {filteredResources.map(resource => {
                            const config = TYPE_CONFIG[resource.type];
                            if (!config) return null; // Skip resources with invalid types
                            return (
                                <div
                                    key={resource.id}
                                    onClick={() => { setSelectedResource(resource); }}
                                    className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer relative flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-3 rounded-2xl transition-colors", config.bgColor)}>
                                                <config.icon className={config.color} size={24} />
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border",
                                                    config.bgColor, config.color
                                                )}>
                                                    {config.label}
                                                </span>
                                                {resource.unitId && (
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-gray-50 text-gray-500 border border-gray-100">
                                                        {resource.unitId.replace('unit-', 'Unit ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => handleOpenEditModal(e, resource)}
                                                    className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Icons.Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, resource.id)}
                                                    className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icons.Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-grow flex flex-col">
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                                {resource.title}
                                            </h3>
                                        </div>

                                        <div className="pt-4 mt-3 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400 flex-wrap gap-2">
                                            <span>{new Date(resource.createdAt || new Date()).toLocaleDateString()}</span>
                                            <div className="flex items-center gap-2">
                                                {resource.type === 'study_note' && (
                                                    <button
                                                        onClick={(e) => handleCopyPrompt(e, resource)}
                                                        className={cn(
                                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all border shadow-sm text-[11px]",
                                                            copiedId === resource.id
                                                                ? "bg-green-50 text-green-600 border-green-200"
                                                                : "bg-purple-50 text-purple-600 border-purple-100/50 hover:bg-purple-100 hover:text-purple-700"
                                                        )}
                                                        title="Generate AI Study Prompt"
                                                    >
                                                        {copiedId === resource.id ? (
                                                            <>
                                                                <Icons.Check size={11} className="text-green-500" />
                                                                <span>Copied!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Icons.Sparkles size={11} className="text-purple-500" />
                                                                <span>AI Prompt</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                <span className="group-hover:translate-x-1 transition-transform text-blue-600 flex items-center gap-1 font-bold">
                                                    Read More <Icons.ArrowRight size={12} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add/Edit Resource Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl p-8 animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{editingId ? 'Edit Resource' : 'Add New Resource'}</h2>
                                <p className="text-sm text-gray-500 mt-1">Fill in the details below to {editingId ? 'update' : 'create'} a resource.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Icons.X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">Subject</label>
                                    <div className="relative">
                                        <select
                                            value={formData.subjectId}
                                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all hover:bg-gray-100"
                                        >
                                            <option value="">Select Subject...</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                                        </select>
                                        <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">Unit <span className="text-gray-300 font-normal normal-case">(Optional)</span></label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(unit => {
                                            const unitId = `unit-${unit}`;
                                            const isActive = formData.unitId === unitId;
                                            return (
                                                <button
                                                    key={unit}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, unitId: isActive ? '' : unitId })}
                                                    className={cn(
                                                        "flex-1 h-10 rounded-xl text-xs font-bold transition-all border",
                                                        isActive
                                                            ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                    )}
                                                >
                                                    U{unit}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as VaultResourceType })}
                                            className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none pr-10"
                                        >
                                            {(['study_note', 'question_bank', 'case_study', 'project', 'revision_note', 'youtube_video', 'flashcard', 'other_resources'] as VaultResourceType[]).map(type => {
                                                const config = TYPE_CONFIG[type];
                                                return (
                                                    <option key={type} value={type}>
                                                        {config.label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                        <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter a descriptive title..."
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium placeholder:text-gray-400 transition-all hover:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-1">Resource Link</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={formData.link || ''}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full p-4 pl-10 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium placeholder:text-gray-400 transition-all hover:bg-gray-100"
                                    />
                                    <Icons.Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 pl-1">
                                    Paste the deployed HTML, PDF, or Drive URL here.
                                </p>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving || !formData.title || !formData.subjectId || !formData.link}
                                className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[22px] text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
                            >
                                {isSaving ? <Icons.Loader2 className="animate-spin" /> : (editingId ? <Icons.Save size={18} /> : <Icons.Plus size={18} />)}
                                {isSaving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Resource' : 'Add Resource')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Resource Modal (Reading Mode) */}
            {selectedResource && !isModalOpen && !deleteConfirmId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/50 backdrop-blur-xl rounded-t-[32px]">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 rounded-2xl shrink-0 mt-1", TYPE_CONFIG[selectedResource.type].bgColor)}>
                                    {React.createElement(TYPE_CONFIG[selectedResource.type].icon, {
                                        className: TYPE_CONFIG[selectedResource.type].color,
                                        size: 24
                                    })}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border",
                                            TYPE_CONFIG[selectedResource.type].bgColor,
                                            TYPE_CONFIG[selectedResource.type].color
                                        )}>
                                            {TYPE_CONFIG[selectedResource.type].label}
                                        </span>
                                        {selectedResource.unitId && (
                                            <span className="text-xs font-bold text-gray-400">
                                                • Unit {selectedResource.unitId.replace('unit-', '')}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900 leading-tight">
                                        {selectedResource.title}
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        if (htmlContent && selectedResource?.link?.includes('/storage/v1/object/public/vault/') && selectedResource.link.endsWith('.html')) {
                                            const blob = new Blob([htmlContent], { type: 'text/html' });
                                            const url = URL.createObjectURL(blob);
                                            window.open(url, '_blank');
                                        } else if (selectedResource?.link) {
                                            window.open(selectedResource.link, '_blank');
                                        }
                                    }}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-blue-600"
                                    title="Open in new tab"
                                >
                                    <Icons.ExternalLink size={20} />
                                </button>
                                <button
                                    onClick={() => setSelectedResource(null)}
                                    className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    <Icons.X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-b-[32px] relative">
                            {selectedResource.link ? (
                                (htmlContent) ? (
                                    <iframe
                                        srcDoc={htmlContent}
                                        className="w-full h-full border-0 bg-white"
                                        title="Resource Preview"
                                        allow="autoplay; encrypted-media"
                                        sandbox="allow-scripts allow-same-origin allow-popups"
                                    />
                                ) : (
                                    <iframe
                                        src={selectedResource.type === 'youtube_video' ? getYoutubeEmbedUrl(selectedResource.link) : selectedResource.link}
                                        className="w-full h-full border-0 bg-white"
                                        title="Resource Preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Icons.Link className="text-gray-400" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">No Link Available</h3>
                                        <p className="text-gray-500 max-w-sm mt-2">
                                            This resource doesn't have a valid link attached to it.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="text-center space-y-4">
                            <div className="w-14 h-14 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                                <Icons.AlertTriangle className="text-red-500" size={28} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900">Delete Resource?</h3>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this resource? This action cannot be undone.
                            </p>
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
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
