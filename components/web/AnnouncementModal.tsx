"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import { Announcement } from '@/types';
import { useAppStore } from '@/lib/store/useAppStore';
import { Icons } from '@/components/shared/Icons';
import { createAnnouncement, updateAnnouncement, deleteAnnouncement as apiDeleteAnnouncement, getAnnouncements, uploadAnnouncementAttachment } from '@/lib/services/announcement-service';
import { useSemester } from '@/components/providers/SemesterProvider';
import { toast } from 'sonner';

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement;
}

export function AnnouncementModal({ isOpen, onClose, announcement }: AnnouncementModalProps) {
    const { addAnnouncement, updateAnnouncement: storeUpdateAnnouncement, deleteAnnouncement: storeDeleteAnnouncement, setAnnouncements } = useAppStore();
    const { activeSemesterId } = useSemester();

    const [formData, setFormData] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        resourceLink: '',
        date: new Date().toISOString().split('T')[0],
        type: 'info'
    });

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (announcement) {
            setFormData(announcement);
            setPreviewUrl(announcement.attachmentUrl || null);
            setFile(null);
        } else {
            setFormData({
                title: '',
                content: '',
                resourceLink: '',
                date: new Date().toISOString().split('T')[0],
                type: 'info'
            });
            setFile(null);
            setPreviewUrl(null);
        }
    }, [announcement, isOpen]);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (!isOpen) return;
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1 || items[i].type === 'application/pdf') {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        const pastedFile = new File([blob], `pasted-file-${Date.now()}.${items[i].type.split('/')[1]}`, { type: items[i].type });
                        setFile(pastedFile);
                        if (items[i].type.indexOf('image') !== -1) {
                            const reader = new FileReader();
                            reader.onloadend = () => setPreviewUrl(reader.result as string);
                            reader.readAsDataURL(pastedFile);
                        } else {
                            setPreviewUrl(null);
                        }
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewUrl(reader.result as string);
                reader.readAsDataURL(selectedFile);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setFormData({ ...formData, attachmentUrl: '', attachmentName: '', attachmentType: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            let finalFormData = { 
                ...formData,
                semesterId: activeSemesterId ?? undefined
            };

            // Upload file if new one is selected
            if (file) {
                const uploadResult = await uploadAnnouncementAttachment(file);
                finalFormData.attachmentUrl = uploadResult.url;
                finalFormData.attachmentName = uploadResult.name;
                finalFormData.attachmentType = uploadResult.type;
            }

            const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

            const isExistingDBRecord = announcement && isUUID(announcement.id);

            if (isExistingDBRecord) {
                const updated = await updateAnnouncement({
                    ...announcement,
                    ...finalFormData,
                } as Announcement);
                storeUpdateAnnouncement(updated);
            } else {
                const created = await createAnnouncement(finalFormData);
                addAnnouncement(created);

                if (announcement && !isUUID(announcement.id)) {
                    storeDeleteAnnouncement(announcement.id);
                }
            }

            const all = await getAnnouncements(activeSemesterId ?? undefined);
            setAnnouncements(all);

            onClose();
        } catch (error: any) {
            console.error('Failed to save announcement:', error);
            toast.error(`Failed to save announcement. ${error.message || 'Please check your connection.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (announcement) {
            if (isSubmitting) return;
            setIsSubmitting(true);
            try {
                const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

                if (isUUID(announcement.id)) {
                    await apiDeleteAnnouncement(announcement.id);
                }

                storeDeleteAnnouncement(announcement.id);

                const all = await getAnnouncements(activeSemesterId ?? undefined);
                setAnnouncements(all);

                onClose();
            } catch (error: any) {
                console.error('Failed to delete announcement:', error);
                toast.error(`Failed to delete announcement. ${error.message || ''}`);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100 shadow-sm">
                        <Icons.Analytics size={24} />
                    </div>
                    <DialogTitle>{announcement ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
                    <DialogDescription>
                        {announcement ? 'Update your broadcast to the academic community.' : 'Share an important update with all students.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Category</Label>
                            <select
                                id="type"
                                className="w-full bg-white/50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none appearance-none cursor-pointer transition-all"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as Announcement['type'] })}
                                disabled={isSubmitting}
                            >
                                <option value="info">Info</option>
                                <option value="warning">Alert</option>
                                <option value="success">Success</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Attachment</Label>
                            <div className="flex items-center gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <input type="file" className="hidden" onChange={handleFileChange} disabled={isSubmitting} />
                                    <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-xs font-bold text-gray-500">
                                        <Icons.Paperclip size={14} />
                                        <span>{file || formData.attachmentUrl ? 'Change' : 'Attach File'}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Headline</Label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Mid-semester Results"
                            className="w-full bg-white/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none placeholder:text-gray-400/80 transition-all shadow-sm"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Message Content</Label>
                        <textarea
                            id="content"
                            rows={3}
                            placeholder="Type your detailed message here... (Tip: You can Paste images and PDFs too!)"
                            className="w-full bg-white/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none placeholder:text-gray-400/80 transition-all shadow-sm resize-none"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {(file || formData.attachmentUrl) && (
                        <div className="relative group rounded-2xl border border-gray-100 bg-gray-50/50 p-2 overflow-hidden">
                            <div className="flex items-center gap-3">
                                {previewUrl && (file?.type.startsWith('image/') || announcement?.attachmentType?.startsWith('image/')) ? (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200/50 bg-white">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500 border border-blue-100">
                                        {(file?.type === 'application/pdf' || formData.attachmentType === 'application/pdf') ? <Icons.FileText size={24} /> : <Icons.File size={24} />}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-gray-700 truncate">{file ? file.name : formData.attachmentName}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Attached'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <Icons.X size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="resourceLink">Resource Link (Optional)</Label>
                        <input
                            id="resourceLink"
                            type="url"
                            placeholder="https://example.com/resource"
                            className="w-full bg-white/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none placeholder:text-gray-400/80 transition-all shadow-sm"
                            value={formData.resourceLink || ''}
                            onChange={(e) => setFormData({ ...formData, resourceLink: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        {announcement && (
                            <Button type="button" variant="danger" className="rounded-2xl flex-1 md:flex-none" onClick={handleDelete} disabled={isSubmitting}>
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </Button>
                        )}
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl flex-1 md:flex-none" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-2xl flex-1 md:flex-none px-8" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : (announcement ? 'Update Now' : 'Publish Update')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
