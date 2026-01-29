"use client"

import React, { useState, useRef } from 'react';
import { Icons } from '@/components/shared/Icons';
import { ResourceService } from '@/lib/services/resource-service';
import { toast } from 'sonner';

interface AddResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = [
    'Technical Skills', 'Business Strategy', 'Career & Soft Skills',
    'Roadmap', 'Cheat Sheet', 'YouTube', 'Coding', 'Academic',
    'Learning & Trends', 'Interview Prep', 'Gems GPTs'
];

const TYPES = ['Link', 'Video', 'Article', 'PDF', 'Template'];

export function AddResourceModal({ isOpen, onClose, onSuccess }: AddResourceModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORIES[0],
        type: TYPES[0],
        url: '',
        topic: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalUrl = formData.url;

            // 1. Upload File (if applicable)
            if ((formData.type === 'PDF' || formData.type === 'Template') && selectedFile) {
                const toastId = toast.loading('Uploading file...');
                finalUrl = await ResourceService.uploadFile(selectedFile);
                toast.dismiss(toastId);
            } else if (!finalUrl && !selectedFile) {
                toast.error('Please provide a URL or upload a file.');
                setIsLoading(false);
                return;
            }

            // 2. Create Resource
            await ResourceService.create({
                ...formData,
                url: finalUrl,
                // Default topic to category if empty
                topic: formData.topic || formData.category,
                type: formData.type as any,
            });

            toast.success('Resource added successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add resource.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add Resource</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Icons.X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g., Advanced SQL Guide"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Brief description of the resource..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Type</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <Icons.ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* File Upload or URL */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {(formData.type === 'PDF' || formData.type === 'Template') ? 'Upload File' : 'Resource URL'}
                        </label>

                        {(formData.type === 'PDF' || formData.type === 'Template') ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-center group"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.xlsx,.pptx"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                />
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Icons.Upload size={24} />
                                </div>
                                <p className="text-sm font-bold text-gray-700">
                                    {selectedFile ? selectedFile.name : "Click to upload file"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX (Max 50MB)</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <Icons.Link className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    required
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    {/* Topic (Optional) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Topic (Optional)</label>
                        <input
                            type="text"
                            placeholder="Sub-topic e.g., 'Excel Formulas'"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Icons.Loader2 size={20} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <span>Add Resource</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
