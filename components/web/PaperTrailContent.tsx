"use client"

import React, { useState, useEffect } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PYQService, PYQFile } from '@/lib/services/pyq-service';
import { SubjectService } from '@/lib/data/subject-service';
import { Subject } from '@/types';
import { useSemester } from '@/components/providers/SemesterProvider';
import { supabase } from '@/utils/supabase/client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/shared/Dialog";

export function PaperTrailContent() {
    const { activeSemesterId, activeSemester } = useSemester();
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Data State
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [pyqs, setPyqs] = useState<PYQFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [previewFile, setPreviewFile] = useState<PYQFile | null>(null);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [uploadMode, setUploadMode] = useState<'link' | 'file'>('link');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    // Form State for Add/Edit
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        subjectId: '',
        title: '',
        year: '',
        type: 'pdf' as 'pdf' | 'word' | 'image',
        url: ''
    });

    useEffect(() => {
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setIsAdmin(profile?.role === 'admin');
            }
        };
        initAuth();
    }, []);

    useEffect(() => {
        SubjectService.getAll(activeSemesterId ?? undefined).then(setSubjects);
    }, [activeSemesterId]);

    const loadPYQs = async () => {
        setIsLoading(true);
        const data = await PYQService.getAll(searchQuery, activeSemesterId ?? undefined);
        setPyqs(data);
        setIsLoading(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadPYQs();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, activeSemesterId]);

    const handlePreview = (pyq: PYQFile) => {
        if (pyq.type === 'word') {
            toast.info("Word documents cannot be previewed directly. Downloading instead.");
            handleDownload(pyq);
            return;
        }
        setPreviewFile(pyq);
    };

    const handleDownload = (pyq: PYQFile) => {
        const link = document.createElement('a');
        link.href = pyq.url;
        link.download = `${pyq.title} - ${pyq.year}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyUniversalPrompt = () => {
        const programLabel = activeSemester?.programName 
            ? `${activeSemester.programName}${activeSemester.name ? ` - ${activeSemester.name}` : ''}`
            : activeSemester?.name || 'our academic program';

        const prompt = `I am a student studying in ${programLabel}. I have attached/will provide a question paper for one of our courses. 

Please act as an expert academic evaluator and professor. I want you to solve the questions from this paper according to the following strict constraints:

1. UNDERSTAND THE PROGRAM LEVEL: Provide answers appropriate for the level of ${programLabel}.
2. MARKS CONSIDERATION: Gauge the length and depth of each answer based on the marks allocated:
   - For 2 marks questions: Provide a precise answer of 4-5 lines.
   - For 7 or 8 marks questions: Provide a detailed explanation spanning approximately 2 pages (approx. 500-600 words).
   - For 10 marks questions: Provide a comprehensive, in-depth explanation spanning approximately 3 pages (approx. 800-900 words).
   - For 15 marks questions: Provide an exhaustive, highly detailed analysis spanning approximately 4 pages (approx. 1100-1200 words).
3. STRUCTURAL FORMAT: Format each answer beautifully using clean Markdown, featuring clear headers, key points, bullet lists, and relevant examples where applicable.
4. DELIVERY: Crucially, answer **only one question at a time**. After providing the answer to the first question, ask me if you should proceed to the next one.`;

        navigator.clipboard.writeText(prompt)
            .then(() => {
                setCopiedPrompt(true);
                toast.success("Universal AI Prompt copied to clipboard!");
                setTimeout(() => setCopiedPrompt(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy prompt:", err);
                toast.error("Failed to copy prompt. Please try again.");
            });
    };

    const handleSavePYQ = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        let finalUrl = formData.url;
        if (uploadMode === 'file' && selectedFile) {
            const url = await PYQService.uploadFile(selectedFile);
            if (url) finalUrl = url;
            else {
                toast.error("File upload failed");
                setIsSaving(false);
                return;
            }
        }

        const payload = { ...formData, url: finalUrl };

        if (editingId) {
            const success = await PYQService.update(editingId, payload);
            if (success) {
                toast.success('PYQ updated successfully');
                loadPYQs();
                setIsAddModalOpen(false);
            } else {
                toast.error('Failed to update PYQ');
            }
        } else {
            const newPYQ = await PYQService.create(payload);
            if (newPYQ) {
                toast.success('PYQ added successfully');
                loadPYQs();
                setIsAddModalOpen(false);
            } else {
                toast.error('Failed to add PYQ');
            }
        }
        setIsSaving(false);
    };

    const handleEditClick = (pyq: PYQFile) => {
        setFormData({
            subjectId: pyq.subjectId,
            title: pyq.title,
            year: pyq.year,
            type: pyq.type,
            url: pyq.url
        });
        setEditingId(pyq.id);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (confirm("Are you sure you want to delete this PYQ?")) {
            const success = await PYQService.delete(id);
            if (success) {
                toast.success('PYQ deleted');
                loadPYQs();
            } else {
                toast.error('Failed to delete PYQ');
            }
        }
    };

    const openAddModal = () => {
        setFormData({ subjectId: subjects[0]?.id || '', title: '', year: new Date().getFullYear().toString(), type: 'pdf', url: '' });
        setEditingId(null);
        setUploadMode('link');
        setSelectedFile(null);
        setIsAddModalOpen(true);
    };

    return (
        <WebAppShell>
            <div className="h-[calc(100vh-140px)] flex flex-col gap-6 max-w-[1800px] mx-auto">
                {/* Header & Search */}
                <div className="flex items-center justify-between gap-2 md:gap-4 shrink-0">
                    <div>
                        <h1 className="text-[10px] font-black text-gray-300 mb-1 uppercase tracking-[0.2em] hidden sm:block">Archive</h1>
                        <p className="text-xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Paper Trail <span className="hidden sm:inline">PYQs</span></p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <button
                            onClick={handleCopyUniversalPrompt}
                            className={cn(
                                "flex items-center justify-center gap-2 px-3 py-2.5 md:px-5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0",
                                copiedPrompt
                                    ? "bg-green-50 text-green-600 border border-green-200"
                                    : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-100"
                            )}
                        >
                            {copiedPrompt ? (
                                <>
                                    <Icons.Check size={16} className="text-green-500" />
                                    <span className="hidden sm:inline">Prompt Copied!</span>
                                    <span className="sm:hidden">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Icons.Sparkles size={16} />
                                    <span className="hidden sm:inline">Copy Universal AI Prompt</span>
                                    <span className="sm:hidden">Prompt</span>
                                </>
                            )}
                        </button>
                        {isAdmin && (
                            <button
                                onClick={openAddModal}
                                className="flex items-center justify-center gap-2 px-3 py-2.5 md:px-5 md:py-3 bg-gray-900 text-white rounded-xl font-bold text-xs md:text-sm hover:bg-black transition-all active:scale-95 shadow-sm whitespace-nowrap shrink-0"
                            >
                                <Icons.Plus size={16} className="md:hidden" />
                                <Icons.Plus size={18} className="hidden md:block" />
                                <span className="hidden sm:inline">Add PYQ</span>
                                <span className="sm:hidden">Add</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center shrink-0 z-10 relative">
                    <Icons.Search size={20} className="text-gray-400 absolute left-6" />
                    <input 
                        type="text"
                        placeholder="Search PYQs by subject, title, or year..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-4 py-3 bg-gray-50 hover:bg-gray-100 border-none rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                <div className="hidden sm:flex text-[11px] font-medium text-purple-600 bg-purple-50/50 border border-purple-100/50 p-3.5 rounded-2xl items-start gap-2 leading-relaxed shrink-0">
                    <Icons.Info size={14} className="shrink-0 mt-0.5 text-purple-500" />
                    <span>
                        <strong>How to use:</strong> Click the <strong>"AI Study Prompt"</strong> button at the top to copy a structured prompt tailored to your program level. Download any PYQ paper, upload it to your preferred AI (ChatGPT or Gemini), and paste the copied prompt to solve the questions step-by-step with mark-based answer limits.
                    </span>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 pr-2">
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-gray-100 animate-pulse h-48 rounded-3xl" />
                            ))}
                        </div>
                    ) : pyqs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                            <Icons.FileText size={48} className="mb-4 opacity-20" />
                            <p className="font-bold">{searchQuery ? "No PYQs match your search." : "No PYQs available."}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                            {pyqs.map(pyq => (
                                <div key={pyq.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col relative">
                                    {isAdmin && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button onClick={() => handleEditClick(pyq)} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white shadow-sm rounded-lg border border-gray-100">
                                                <Icons.Edit size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(pyq.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white shadow-sm rounded-lg border border-gray-100">
                                                <Icons.Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 shrink-0">
                                            <Icons.FileText size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-0.5">{pyq.subjectCode}</div>
                                            <div className="text-xs font-bold text-gray-500 line-clamp-1">{pyq.subjectTitle}</div>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 flex-1">
                                        {pyq.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-md">
                                            {pyq.year}
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-md">
                                            {pyq.type.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-50">
                                        <button 
                                            onClick={() => handlePreview(pyq)}
                                            className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Icons.Eye size={14} /> Preview
                                        </button>
                                        <button 
                                            onClick={() => handleDownload(pyq)}
                                            className="w-10 h-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all shrink-0"
                                            title="Download PDF/File"
                                        >
                                            <Icons.Download size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit PYQ' : 'Add PYQ'}</DialogTitle>
                            <DialogDescription>Add a Previous Year Question paper using a file link.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSavePYQ} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400">Subject</label>
                                <select required value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20">
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400">Title</label>
                                <input required type="text" placeholder="e.g. End Semester Exam" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Year</label>
                                    <input required type="text" placeholder="e.g. 2023" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400">File Type</label>
                                    <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20">
                                        <option value="pdf">PDF</option>
                                        <option value="word">Word</option>
                                        <option value="image">Image</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                                <button type="button" onClick={() => setUploadMode('link')} className={cn("px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all", uploadMode === 'link' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>Link</button>
                                <button type="button" onClick={() => setUploadMode('file')} className={cn("px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all", uploadMode === 'file' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>Upload</button>
                            </div>
                            {uploadMode === 'link' ? (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400">File URL (Google Drive, etc.)</label>
                                    <input required={uploadMode === 'link'} type="url" placeholder="https://..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400">Upload File</label>
                                    <input required={uploadMode === 'file' && !editingId} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                            )}
                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm active:scale-95">
                                    {isSaving ? 'Saving...' : 'Save PYQ'}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Preview Modal */}
                <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
                    <DialogContent className="sm:max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10 shrink-0">
                            <div>
                                <DialogTitle className="text-xl font-black text-gray-900">PYQ Preview</DialogTitle>
                                <DialogDescription className="text-xs font-bold text-gray-500 mt-1">
                                    {previewFile?.title} ({previewFile?.year}) - {previewFile?.subjectTitle}
                                </DialogDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => previewFile && handleDownload(previewFile)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 text-xs font-bold">
                                    <Icons.Download size={16} />
                                    <span className="hidden sm:inline">Download</span>
                                </button>
                                <button onClick={() => setPreviewFile(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                                    <Icons.X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 w-full bg-gray-100 overflow-hidden relative">
                            {previewFile?.url ? (
                                previewFile.type === 'image' ? (
                                    <div className="w-full h-full flex items-center justify-center p-4 bg-white">
                                        <img src={previewFile.url} className="max-w-full max-h-full object-contain rounded-lg shadow-sm" alt="PYQ Preview" />
                                    </div>
                                ) : (
                                    <iframe src={previewFile.url} className="w-full h-full border-0 absolute inset-0" title="PYQ Preview" />
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 font-bold">No file available for preview.</div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </WebAppShell>
    );
}
