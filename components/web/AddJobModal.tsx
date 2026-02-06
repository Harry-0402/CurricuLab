"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { JobService, JobListing } from '@/lib/services/job-service';
import { AiService } from '@/lib/services/ai-service';
import { toast } from 'sonner';

interface AddJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: JobListing; // Optional for Edit mode
}

export function AddJobModal({ isOpen, onClose, onSuccess, initialData }: AddJobModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<JobListing>>({
        title: '',
        company: '',
        location: '',
        type: 'Remote',
        salary_range: '',
        url: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset for Create mode
            setFormData({
                title: '',
                company: '',
                location: '',
                type: 'Remote',
                salary_range: '',
                url: '',
            });
        }
    }, [initialData, isOpen]);

    const [pasteContent, setPasteContent] = useState('');
    const [showPaste, setShowPaste] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // New State for PDF
    const [pasteMode, setPasteMode] = useState<'text' | 'pdf'>('text');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPreview, setPdfPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setPdfFile(file);
            const url = URL.createObjectURL(file);
            setPdfPreview(url);
        }
    };

    const handleRemovePdf = () => {
        setPdfFile(null);
        setPdfPreview(null);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                let encoded = reader.result?.toString().replace(/^data:(.*,)?/, "");
                if (encoded) {
                    if ((encoded.length % 4) > 0) {
                        encoded += '='.repeat(4 - (encoded.length % 4));
                    }
                    resolve(encoded);
                } else {
                    reject(new Error("Failed to encode"));
                }
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSmartPaste = async () => {
        if (pasteMode === 'text' && !pasteContent.trim()) return;
        if (pasteMode === 'pdf' && !pdfFile) return;

        setIsAnalyzing(true);

        try {
            let data: any;

            if (pasteMode === 'text') {
                data = await AiService.parseJobDescription(pasteContent);
            } else if (pasteMode === 'pdf' && pdfFile) {
                const base64 = await fileToBase64(pdfFile);
                data = await AiService.parseJobFile(base64, pdfFile.type);
            }

            setFormData(prev => ({
                ...prev,
                title: data.title || prev.title,
                company: data.company || prev.company,
                location: data.location || prev.location,
                salary_range: data.salary_range || prev.salary_range,
                url: data.url || prev.url,
                type: (data.type as any) || prev.type
            }));

            toast.success('Smart Paste: AI extracted details!');
            setShowPaste(false);
            // Cleanup
            setPasteMode('text');
            setPdfFile(null);
            setPdfPreview(null);
        } catch (error) {
            console.error(error);
            toast.error('AI Extraction Failed. Please try manually.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                // Update specific fields (excluding ID/dates)
                await JobService.update(initialData.id, {
                    title: formData.title,
                    company: formData.company,
                    location: formData.location,
                    type: formData.type,
                    salary_range: formData.salary_range,
                    url: formData.url
                });
                toast.success('Job updated successfully!');
            } else {
                await JobService.create(formData as JobListing);
                toast.success('Job posted successfully!');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(initialData ? 'Failed to update job.' : 'Failed to post job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{initialData ? 'Edit Job' : 'Post a Job'}</h2>
                        <p className="text-xs text-gray-500 font-medium mt-1">{initialData ? 'Update job details' : 'Share an opportunity with the community'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Icons.X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Smart Paste Toggle */}
                    {!initialData && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowPaste(!showPaste)}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl text-indigo-700 font-bold text-sm hover:shadow-md transition-all group"
                            >
                                <span className="flex items-center gap-2">
                                    <Icons.Sparkles size={16} className={showPaste ? "text-indigo-600" : "animate-pulse text-indigo-600"} />
                                    Smart Paste from WhatsApp
                                </span>
                                <Icons.ChevronDown size={16} className={`transition-transform duration-300 ${showPaste ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`grid transition-all duration-300 ease-in-out ${showPaste ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="space-y-4 overflow-hidden">
                                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                                        <button
                                            type="button"
                                            onClick={() => setPasteMode('text')}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pasteMode === 'text' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Text
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPasteMode('pdf')}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pasteMode === 'pdf' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            PDF / Image Upload
                                        </button>
                                    </div>

                                    {pasteMode === 'text' ? (
                                        <textarea
                                            className="w-full p-4 bg-gray-50 border-2 border-indigo-100 focus:border-indigo-500 rounded-xl text-sm min-h-[120px] outline-none transition-all placeholder:text-gray-400"
                                            placeholder="Paste the message here... (e.g. 'Hiring Java Dev at Google, Bangalore...')"
                                            value={pasteContent}
                                            onChange={(e) => setPasteContent(e.target.value)}
                                        />
                                    ) : (
                                        <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 flex flex-col items-center justify-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors relative">
                                            {pdfPreview ? (
                                                <div className="w-full space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-indigo-700 truncate max-w-[200px]">{pdfFile?.name}</span>
                                                        <button
                                                            onClick={handleRemovePdf}
                                                            className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                                                        >
                                                            <Icons.Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    {pdfFile?.type.startsWith('image/') ? (
                                                        <img
                                                            src={pdfPreview}
                                                            className="w-full h-[200px] object-contain rounded-lg border border-gray-200 bg-white"
                                                            alt="Preview"
                                                        />
                                                    ) : (
                                                        <iframe
                                                            src={pdfPreview}
                                                            className="w-full h-[200px] rounded-lg border border-gray-200 bg-white"
                                                            title="PDF Preview"
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <Icons.UploadCloud className="text-indigo-400 mb-2" size={32} />
                                                    <p className="text-sm font-bold text-indigo-900">Click to upload PDF or Image</p>
                                                    <p className="text-xs text-indigo-500 mt-1">Maximum size: 5MB</p>
                                                    <input
                                                        type="file"
                                                        accept="application/pdf,image/png,image/jpeg,image/webp"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={handleFileChange}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleSmartPaste}
                                        disabled={isAnalyzing || (pasteMode === 'text' && !pasteContent.trim()) || (pasteMode === 'pdf' && !pdfFile)}
                                        className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Icons.Loader2 size={14} className="animate-spin" />
                                                <span>Analyzing {pasteMode === 'pdf' ? 'PDF' : 'Text'}...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Icons.Wand2 size={14} />
                                                <span>Auto-Fill with AI</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Job Title</label>
                            <input
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                placeholder="e.g. Senior Product Designer"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Company Name</label>
                            <input
                                required
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                placeholder="e.g. Acme Corp"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Location</label>
                                <input
                                    required
                                    className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                    placeholder="e.g. New York, NY"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Type</label>
                                <select
                                    className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all appearance-none"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="On-site">On-site</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Salary Range (Optional)</label>
                            <input
                                className="w-full p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                placeholder="e.g. $80k - $120k"
                                value={formData.salary_range}
                                onChange={e => setFormData({ ...formData, salary_range: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Application URL</label>
                            <div className="relative">
                                <Icons.Link className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                <input
                                    required
                                    type="url"
                                    className="w-full pl-10 p-3 bg-gray-50 rounded-xl font-semibold border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all"
                                    placeholder="https://"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3.5 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Icons.Loader2 className="animate-spin" /> : <Icons.CheckCircle size={18} />}
                                <span>{initialData ? 'Update Job' : 'Post Job'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
