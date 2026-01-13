"use client"

import React, { useState } from 'react';
import { Announcement } from '@/types';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { AnnouncementModal } from './AnnouncementModal';
import { WidgetSettingsModal } from './WidgetSettingsModal';

interface AnnouncementWidgetProps {
    announcements: Announcement[];
}

export function AnnouncementWidget({ announcements }: AnnouncementWidgetProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | undefined>(undefined);

    const handleAdd = () => {
        setSelectedAnnouncement(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (ann: Announcement) => {
        setSelectedAnnouncement(ann);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Icons.Analytics size={120} className="text-blue-500" />
            </div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shadow-blue-100 border border-blue-50">
                        <Icons.Analytics size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Board Announcements</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latest updates from faculty</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleAdd}
                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-blue-100 rounded-2xl transition-all shadow-none hover:shadow-sm group"
                    >
                        <Icons.Plus size={22} className="group-hover:rotate-90 transition-transform" />
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all shadow-none hover:shadow-sm"
                    >
                        <Icons.Settings size={22} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {announcements.map((ann) => (
                    <div
                        key={ann.id}
                        onClick={() => handleEdit(ann)}
                        className={cn(
                            "p-8 rounded-[32px] border-2 relative group transition-all hover:scale-[1.02] cursor-pointer shadow-sm hover:shadow-xl flex flex-col h-full",
                            ann.type === 'warning' ? "bg-gradient-to-br from-orange-50 to-white border-orange-100" :
                                ann.type === 'success' ? "bg-gradient-to-br from-green-50 to-white border-green-100" :
                                    "bg-gradient-to-br from-blue-50 to-white border-blue-100"
                        )}
                    >
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button className="p-2 bg-white/80 backdrop-blur-md text-gray-400 hover:text-blue-600 rounded-xl shadow-sm border border-gray-100">
                                <Icons.Settings size={14} />
                            </button>
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                ann.type === 'warning' ? "bg-orange-100 text-orange-600" :
                                    ann.type === 'success' ? "bg-green-100 text-green-600" :
                                        "bg-blue-100 text-blue-600"
                            )}>
                                {ann.type === 'warning' ? <Icons.Trend size={20} /> : <Icons.Subjects size={20} />}
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 leading-snug pr-8">{ann.title}</h4>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{ann.date}</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium flex-grow">{ann.content}</p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ann.id + i}`} alt="Faculty" />
                                    </div>
                                ))}
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-400 shadow-sm">
                                    +2
                                </div>
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-sm",
                                ann.type === 'warning' ? "text-orange-600 bg-white border border-orange-100" :
                                    ann.type === 'success' ? "text-green-600 bg-white border border-green-100" :
                                        "text-blue-600 bg-white border border-blue-100"
                            )}>
                                {ann.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <AnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                announcement={selectedAnnouncement}
            />

            <WidgetSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                widgetName="Board Announcements"
            />
        </div>
    );
}
