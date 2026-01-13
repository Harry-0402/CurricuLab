"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';

interface WidgetSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    widgetName: string;
}

export function WidgetSettingsModal({ isOpen, onClose, widgetName }: WidgetSettingsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 mb-4 border border-gray-100 shadow-sm">
                        <Icons.Settings size={24} />
                    </div>
                    <DialogTitle>{widgetName} Settings</DialogTitle>
                    <DialogDescription>
                        Customize how this widget displays information on your dashboard.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <Icons.Time size={20} className="text-blue-500" />
                            <span className="text-sm font-bold text-gray-700">Auto-refresh Data</span>
                        </div>
                        <div className="w-10 h-6 bg-blue-500 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm ml-auto" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <Icons.Subjects size={20} className="text-purple-500" />
                            <span className="text-sm font-bold text-gray-700">Compact View</span>
                        </div>
                        <div className="w-10 h-6 bg-gray-200 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button onClick={onClose} className="rounded-2xl w-full">
                        Close Settings
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
