"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/shared/Dialog';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

interface AnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
    const stats = [
        { label: 'Weekly Study Time', value: '24.5h', trend: '+12%', icon: Icons.Time, color: 'text-blue-600 bg-blue-50' },
        { label: 'Units Completed', value: '18/42', trend: '+4', icon: Icons.Trend, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Avg. Quiz Score', value: '88%', trend: '+5%', icon: Icons.Questions, color: 'text-purple-600 bg-purple-50' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100 shadow-sm">
                        <Icons.Analytics size={24} />
                    </div>
                    <DialogTitle>Academic Analytics</DialogTitle>
                    <DialogDescription>
                        Track your progress and study performance over the current semester.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-4 mt-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-5 bg-white border border-gray-100 rounded-3xl space-y-3 hover:shadow-lg hover:border-blue-100 transition-all group">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-xl font-black text-gray-900 leading-none">{stat.value}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] font-black text-emerald-500">{stat.trend}</span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">this week</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-[35px] border border-gray-100 space-y-4">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest pl-2">Study Distribution</h4>
                    <div className="h-4 w-full bg-gray-200 rounded-full flex overflow-hidden">
                        <div className="h-full bg-blue-500 w-[40%]" />
                        <div className="h-full bg-purple-500 w-[25%]" />
                        <div className="h-full bg-emerald-500 w-[20%]" />
                        <div className="h-full bg-amber-500 w-[15%]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>MBA Business Analytics</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span>Digital Transformation</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-6">
                    <Button onClick={onClose} variant="ghost" className="rounded-2xl">
                        Close
                    </Button>
                    <Button className="rounded-2xl px-8">
                        Detailed Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
