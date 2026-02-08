"use client"

import React, { useState } from 'react';
import { WebAppShell } from '@/components/web/WebAppShell';
import { Icons } from '@/components/shared/Icons';
import { DoubtSection } from '@/components/web/community/DoubtSection';
import { WhatsAppGroups } from '@/components/web/community/WhatsAppGroups';

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'doubts' | 'whatsapp'>('doubts');

    return (
        <WebAppShell>
            <div className="flex flex-col h-full animate-in fade-in duration-500">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Community Forum</h1>
                    <p className="text-gray-500 font-medium">Connect, collaborate, and clarify your doubts with peers and faculty.</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 w-fit mb-8 shadow-sm">
                    <button
                        onClick={() => setActiveTab('doubts')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'doubts'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Icons.MessageCircle size={18} />
                        Discussion & Doubts
                    </button>
                    <button
                        onClick={() => setActiveTab('whatsapp')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'whatsapp'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Icons.Users size={18} />
                        WhatsApp Groups
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'doubts' ? (
                        <div className="animate-in slide-in-from-left-4 duration-300">
                            <DoubtSection />
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <WhatsAppGroups />
                        </div>
                    )}
                </div>
            </div>
        </WebAppShell>
    );
}
