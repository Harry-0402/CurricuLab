"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Label } from '@/components/shared/Label';
import { Announcement } from '@/types';
import { useAppStore } from '@/lib/store/useAppStore';
import { Icons } from '@/components/shared/Icons';

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcement?: Announcement;
}

export function AnnouncementModal({ isOpen, onClose, announcement }: AnnouncementModalProps) {
    const { addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAppStore();

    const [formData, setFormData] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        resourceLink: '',
        date: new Date().toISOString().split('T')[0],
        type: 'info'
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalAnn = {
            ...formData,
            id: announcement?.id || Math.random().toString(36).substr(2, 9),
        } as Announcement;

        if (announcement) {
            updateAnnouncement(finalAnn);
        } else {
            addAnnouncement(finalAnn);
        }
        onClose();
    };

    const handleDelete = () => {
        if (announcement) {
            deleteAnnouncement(announcement.id);
            onClose();
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
                        />
                    </div>

                    <DialogFooter className="gap-2 pt-4">
                        {announcement && (
                            <Button type="button" variant="danger" className="rounded-2xl flex-1 md:flex-none" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl flex-1 md:flex-none">
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-2xl flex-1 md:flex-none px-8">
                            {announcement ? 'Update Now' : 'Publish Update'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
