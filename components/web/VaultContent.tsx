"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { Subject, VaultResource, VaultResourceType } from '@/types';
import { getSubjects, getVaultResources, createVaultResource, updateVaultResource, deleteVaultResource } from '@/lib/services/app.service';
import { AiService } from '@/lib/services/ai-service';
import { useToast } from '@/components/shared/Toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TYPE_CONFIG: Record<VaultResourceType, { label: string; icon: any; color: string; bgColor: string }> = {
    study_note: { label: 'Study Note', icon: Icons.Notes, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-100' },
    case_study: { label: 'Case Study', icon: Icons.FileText, color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-100' },
    project: { label: 'Project', icon: Icons.Lightbulb, color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-100' }
};

export function VaultContent() {
    const { showToast } = useToast();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string>('');
    const [resources, setResources] = useState<VaultResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedResource, setSelectedResource] = useState<VaultResource | null>(null);
    const [selectedType, setSelectedType] = useState<VaultResourceType | 'all'>('all');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        subjectId: '',
        unitId: '',
        partNumber: undefined as number | undefined,
        type: 'study_note' as VaultResourceType,
        title: '',
        content: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    // Delete confirmation state
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // AI formatting state
    const [formattedContent, setFormattedContent] = useState<string>('');
    const [isFormatting, setIsFormatting] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            const fetchedSubjects = await getSubjects();
            setSubjects(fetchedSubjects);
            if (fetchedSubjects.length > 0) {
                setActiveSubjectId(fetchedSubjects[0].id);
            }
            setLoading(false);
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const loadResources = async () => {
            if (!activeSubjectId) return;
            setLoading(true);
            const data = await getVaultResources({
                subjectId: activeSubjectId,
                type: selectedType === 'all' ? undefined : selectedType
            });
            setResources(data);
            setLoading(false);
        };
        loadResources();
    }, [activeSubjectId, selectedType]);

    // Auto-format content when resource is selected
    // Skip AI formatting for long content (over 2000 chars) to avoid truncation
    const CONTENT_LENGTH_LIMIT = 2000;

    useEffect(() => {
        const formatContent = async () => {
            if (!selectedResource?.content) {
                setFormattedContent('');
                return;
            }

            // Use cached formatted content if available
            if (selectedResource.formattedContent) {
                setFormattedContent(selectedResource.formattedContent);
                return;
            }

            // Skip AI formatting for long content - display raw markdown instead
            if (selectedResource.content.length > CONTENT_LENGTH_LIMIT) {
                console.log(`Content too long (${selectedResource.content.length} chars), skipping AI formatting`);
                setFormattedContent(selectedResource.content);
                return;
            }

            // Format with AI (only for shorter content)
            setIsFormatting(true);
            setFormattedContent('');

            try {
                const formatted = await AiService.formatVaultContent(
                    selectedResource.title,
                    selectedResource.content,
                    selectedResource.type
                );
                setFormattedContent(formatted);

                // Cache the formatted content in the database
                const updated = await updateVaultResource({
                    ...selectedResource,
                    formattedContent: formatted
                });

                if (updated) {
                    setSelectedResource(updated);
                }
            } catch (error) {
                console.error("Failed to format content:", error);
                setFormattedContent(selectedResource.content);
            } finally {
                setIsFormatting(false);
            }
        };

        formatContent();
    }, [selectedResource?.id, selectedResource?.content]);

    const activeSubject = subjects.find(s => s.id === activeSubjectId);

    const handleOpenAddModal = () => {
        setEditingId(null);
        setFormData({
            subjectId: activeSubjectId,
            unitId: '',
            partNumber: undefined,
            type: 'study_note',
            title: '',
            content: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (e: React.MouseEvent, resource: VaultResource) => {
        e.stopPropagation();
        setEditingId(resource.id);
        setFormData({
            subjectId: resource.subjectId,
            unitId: resource.unitId || '',
            partNumber: resource.partNumber,
            type: resource.type,
            title: resource.title,
            content: resource.content
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.subjectId || !formData.title) return;

        setIsSaving(true);
        let saved: VaultResource | null = null;

        if (editingId) {
            saved = await updateVaultResource({
                id: editingId,
                subjectId: formData.subjectId,
                unitId: formData.unitId,
                partNumber: formData.partNumber,
                type: formData.type,
                title: formData.title,
                content: formData.content,
                formattedContent: '', // Clear cached format when content changes
                tags: selectedResource?.tags || []
            });
        } else {
            saved = await createVaultResource({
                subjectId: formData.subjectId,
                unitId: formData.unitId,
                partNumber: formData.partNumber,
                type: formData.type,
                title: formData.title,
                content: formData.content,
                formattedContent: '',
                tags: []
            });
        }

        if (saved) {
            showToast(editingId ? 'Resource updated successfully!' : 'Resource added successfully!', 'success');
            setIsModalOpen(false);

            // Refresh list
            const data = await getVaultResources({
                subjectId: activeSubjectId,
                type: selectedType === 'all' ? undefined : selectedType
            });
            setResources(data);

            if (editingId && selectedResource?.id === editingId) {
                setSelectedResource(saved);
            }
        }
        setIsSaving(false);
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmId) return;

        const success = await deleteVaultResource(deleteConfirmId);
        if (success) {
            setResources(prev => prev.filter(r => r.id !== deleteConfirmId));
            if (selectedResource?.id === deleteConfirmId) {
                setSelectedResource(null);
            }
            showToast('Resource deleted', 'info');
        }
        setDeleteConfirmId(null);
    };

    const filteredResources = resources;

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-[1800px] mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em]">Library</h1>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">Knowledge Vault</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Icons.Plus size={18} />
                    <span>Add Resource</span>
                </button>
            </div>

            {/* Subject Switcher */}
            <div className="flex items-center gap-1.5 shrink-0">
                {subjects.map((subject) => {
                    const isActive = activeSubjectId === subject.id;
                    return (
                        <button
                            key={subject.id}
                            onClick={() => { setActiveSubjectId(subject.id); setSelectedResource(null); }}
                            title={subject.title}
                            className={cn(
                                "px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1.5 border shadow-sm",
                                isActive
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600"
                            )}
                        >
                            <span className="text-[10px] font-black tracking-widest uppercase">
                                {subject.code || subject.title.substring(0, 3)}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 bg-white rounded-full shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Type Filter Badges */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={() => setSelectedType('all')}
                    className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        selectedType === 'all'
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                    )}
                >
                    All
                </button>
                {(['study_note', 'case_study', 'project'] as VaultResourceType[]).map(type => {
                    const config = TYPE_CONFIG[type];
                    const isActive = selectedType === type;
                    return (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
                                isActive
                                    ? `${config.bgColor} ${config.color} border-current`
                                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                            )}
                        >
                            <config.icon size={14} />
                            {config.label}s
                        </button>
                    );
                })}
            </div>

            {/* Main Content - Split Pane */}
            <div className="flex-1 flex gap-6 min-h-0">

                {/* Left Panel: Resource List */}
                <div className="w-5/12 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                            Resources ({filteredResources.length})
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                        {loading ? (
                            <div className="flex justify-center p-8"><Icons.Loader2 className="animate-spin text-blue-500" /></div>
                        ) : filteredResources.length === 0 ? (
                            <div className="text-center p-8 text-gray-400 text-sm">No resources found. Add your first resource!</div>
                        ) : (
                            filteredResources.map(resource => {
                                const config = TYPE_CONFIG[resource.type];
                                return (
                                    <div
                                        key={resource.id}
                                        onClick={() => { setSelectedResource(resource); setFormattedContent(''); }}
                                        className={cn(
                                            "p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md group relative",
                                            selectedResource?.id === resource.id
                                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                                : "bg-white border-gray-100 hover:border-blue-100"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase border",
                                                    config.bgColor, config.color
                                                )}>
                                                    {config.label}
                                                </span>
                                                {resource.unitId && (
                                                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-500 border border-gray-200">
                                                        {resource.unitId.replace('unit-', 'U')}
                                                    </span>
                                                )}
                                                {resource.partNumber && (
                                                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-amber-50 text-amber-600 border border-amber-200">
                                                        P{resource.partNumber}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => handleOpenEditModal(e, resource)}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Icons.Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, resource.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icons.Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">{resource.title}</p>
                                        {resource.content && (
                                            <p className="text-xs text-gray-400 line-clamp-2">{resource.content.substring(0, 100)}...</p>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel: Content Display */}
                <div className="w-7/12 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
                    {selectedResource ? (
                        <div className="flex flex-col h-full">
                            {/* Resource Header */}
                            <div className="p-6 border-b border-gray-100 bg-gray-50/30 shrink-0">
                                <div className="flex items-center gap-3 mb-3">
                                    {(() => {
                                        const config = TYPE_CONFIG[selectedResource.type];
                                        return (
                                            <span className={cn(
                                                "px-3 py-1.5 rounded-lg text-xs font-bold border",
                                                config.bgColor, config.color
                                            )}>
                                                {config.label}
                                            </span>
                                        );
                                    })()}
                                    {isFormatting && (
                                        <span className="flex items-center gap-2 text-sm text-gray-400">
                                            <Icons.Loader2 className="animate-spin" size={16} />
                                            Formatting...
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-lg font-black text-gray-900 leading-tight">
                                    {selectedResource.title}
                                </h2>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto p-8 bg-white no-scrollbar">
                                {formattedContent ? (
                                    <div className="w-full prose prose-sm max-w-none">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-gray-800 mt-5 mb-3" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />,
                                                p: ({ node, ...props }) => <p className="text-gray-600 leading-relaxed mb-4" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600" {...props} />,
                                                li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                                                strong: ({ node, ...props }) => <span className="font-bold text-gray-900" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-500 my-4" {...props} />,
                                                code: ({ node, ...props }) => <code className="bg-gray-100 text-blue-600 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                                                table: ({ node, ...props }) => <table className="w-full border-collapse border border-gray-200 my-4 rounded-lg overflow-hidden" {...props} />,
                                                thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                                                tbody: ({ node, ...props }) => <tbody {...props} />,
                                                tr: ({ node, ...props }) => <tr className="border-b border-gray-200" {...props} />,
                                                th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 border border-gray-200" {...props} />,
                                                td: ({ node, ...props }) => <td className="px-4 py-2 text-sm text-gray-600 border border-gray-200" {...props} />
                                            }}
                                        >
                                            {formattedContent}
                                        </ReactMarkdown>
                                    </div>
                                ) : isFormatting ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                        <Icons.Loader2 className="animate-spin text-blue-500" size={48} />
                                        <p className="font-bold text-xs uppercase tracking-widest">Formatting your content...</p>
                                    </div>
                                ) : selectedResource.content ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                            <Icons.FileText size={32} />
                                        </div>
                                        <p className="font-bold text-xs uppercase tracking-widest">Processing...</p>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                            <Icons.Edit size={32} />
                                        </div>
                                        <p className="font-bold text-xs uppercase tracking-widest">No content yet</p>
                                        <p className="text-gray-400 text-sm">Edit this resource to add content</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                            <Icons.ArrowLeft size={32} />
                            <p className="font-bold text-xs uppercase tracking-widest">Select a resource to view details</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Add/Edit Resource Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-900">{editingId ? 'Edit Resource' : 'Add New Resource'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Icons.X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                                <div className="relative">
                                    <select
                                        value={formData.subjectId}
                                        onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    >
                                        <option value="">Select Subject...</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                                    </select>
                                    <Icons.ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Type</label>
                                <div className="flex gap-2">
                                    {(['study_note', 'case_study', 'project'] as VaultResourceType[]).map(type => {
                                        const config = TYPE_CONFIG[type];
                                        const isActive = formData.type === type;
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type })}
                                                className={cn(
                                                    "flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2",
                                                    isActive
                                                        ? `${config.bgColor} ${config.color} border-current`
                                                        : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300"
                                                )}
                                            >
                                                <config.icon size={14} />
                                                {config.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Unit <span className="text-gray-300">(Optional)</span></label>
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
                                                    "flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border",
                                                    isActive
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300"
                                                )}
                                            >
                                                Unit {unit}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Part <span className="text-gray-300">(Optional)</span></label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(part => {
                                        const isActive = formData.partNumber === part;
                                        return (
                                            <button
                                                key={part}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, partNumber: isActive ? undefined : part })}
                                                className={cn(
                                                    "flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border",
                                                    isActive
                                                        ? "bg-amber-500 text-white border-amber-500"
                                                        : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300"
                                                )}
                                            >
                                                Part {part}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter title..."
                                    className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Content</label>
                                <textarea
                                    rows={8}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Enter your content here... (supports markdown)"
                                    className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none placeholder:font-medium resize-none"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving || !formData.title || !formData.subjectId}
                                className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isSaving ? <Icons.Loader2 className="animate-spin" /> : (editingId ? <Icons.Edit size={16} /> : <Icons.PlusCircle size={16} />)}
                                {isSaving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Resource' : 'Add Resource')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
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
