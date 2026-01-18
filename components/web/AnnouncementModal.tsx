"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import { Announcement } from '@/types';
import { useAppStore } from '@/lib/store/useAppStore';
import { Icons } from '@/components/shared/Icons';
import { createAnnouncement, updateAnnouncement, deleteAnnouncement as apiDeleteAnnouncement, getAnnouncements } from '@/lib/services/announcement-service';

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement;
}

export function AnnouncementModal({ isOpen, onClose, announcement }: AnnouncementModalProps) {
    const { addAnnouncement, updateAnnouncement: storeUpdateAnnouncement, deleteAnnouncement: storeDeleteAnnouncement, setAnnouncements } = useAppStore();

    const [formData, setFormData] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        resourceLink: '',
        date: new Date().toISOString().split('T')[0],
        type: 'info'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (announcement) {
            setFormData(announcement);
        } else {
            setFormData({
                title: '',
                content: '',
                resourceLink: '',
                date: new Date().toISOString().split('T')[0],
                type: 'info'
            });
        }
    }, [announcement, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

            // Only try to update if it's an existing announcement with a valid UUID
            // Otherwise, it's either a new one or a legacy local one that needs to be published
            const isExistingDBRecord = announcement && isUUID(announcement.id);

            if (isExistingDBRecord) {
                const updated = await updateAnnouncement({
                    ...announcement,
                    ...formData,
                } as Announcement);
                storeUpdateAnnouncement(updated);
            } else {
                const created = await createAnnouncement(formData);
                addAnnouncement(created);

                // If it was a legacy local announcement, remove it now that it's published
                if (announcement && !isUUID(announcement.id)) {
                    storeDeleteAnnouncement(announcement.id);
                }
            }

            // Refresh all announcements to ensure sync and proper order
            const all = await getAnnouncements();
            setAnnouncements(all);

            onClose();
        } catch (error: any) {
            console.error('Failed to save announcement:', error);

            // Log full error details for debugging
            const errorDetails = error.message || error.details || JSON.stringify(error, null, 2);
            console.error('Detailed error:', errorDetails);

            alert(`Failed to save announcement. ${error.message || 'Please check if the database table exists.'}`);
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

                // Only call API if it's an existing DB record
                if (isUUID(announcement.id)) {
                    await apiDeleteAnnouncement(announcement.id);
                }

                storeDeleteAnnouncement(announcement.id);

                // Refresh to ensure sync
                const all = await getAnnouncements();
                setAnnouncements(all);

                onClose();
            } catch (error: any) {
                console.error('Failed to delete announcement:', error);
                const errorDetails = error.message || error.details || JSON.stringify(error, null, 2);
                console.error('Detailed error:', errorDetails);
                alert(`Failed to delete announcement. ${error.message || ''}`);
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
                    <div className="space-y-2">
                        <Label htmlFor="type">Announcement Type</Label>
                        <select
                            id="type"
                            className="w-full bg-white/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none appearance-none cursor-pointer transition-all"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as Announcement['type'] })}
                            disabled={isSubmitting}
                        >
                            <option value="info">Information (Blue)</option>
                            <option value="warning">Alert (Orange)</option>
                            <option value="success">Success (Green)</option>
                        </select>
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
                            rows={4}
                            placeholder="Type your detailed message here..."
                            className="w-full bg-white/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none placeholder:text-gray-400/80 transition-all shadow-sm resize-none"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

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
