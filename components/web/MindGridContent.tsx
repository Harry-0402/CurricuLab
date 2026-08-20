"use client"

import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';
import { WebAppShell } from '@/components/web/WebAppShell';
import AddAgentModal from './AddAgentModal';

import { MindGridService } from '@/lib/services/mindgrid-service';
import { supabase } from '@/utils/supabase/client';

import { toast } from 'sonner';

export interface Agent {
    id: string;
    user_id?: string;
    name: string;
    description: string;
    url: string;
    platform: 'openai' | 'google' | 'other';
    category: 'General' | 'Writing' | 'Productivity' | 'Research & Analysis' | 'Education' | 'Lifestyle' | 'DALL·E' | 'Programming';
    is_default?: boolean;
}

export default function MindGridContent() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [activeFilter, setActiveFilter] = useState<'All' | Agent['platform']>('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const loadAgents = async (isInitial = false) => {
        // If initial load and we have cached data, don't show the full skeleton
        if (isInitial) {
            const cached = localStorage.getItem('mindgrid_cache');
            if (cached) {
                try {
                    setAgents(JSON.parse(cached));
                    setIsLoading(false);
                } catch (e) {
                    console.error('Failed to parse cache');
                }
            }
        } else {
            setIsLoading(true);
        }

        try {
            const data = await MindGridService.getAll();
            setAgents(data);
            localStorage.setItem('mindgrid_cache', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to load agents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
        };
        fetchUser();
        loadAgents(true);
    }, []);

    const handleSaveAgent = async (agentData: Omit<Agent, 'id'>, id?: string) => {
        try {
            if (!currentUser) {
                toast.error("You must be logged in to register an AI unit.");
                return;
            }

            if (id) {
                await MindGridService.update(id, agentData);
                toast.success("AI unit updated successfully!");
            } else {
                await MindGridService.create(agentData);
                toast.success("AI unit registered successfully!");
            }
            await loadAgents();
            setShowAddModal(false);
            setEditingAgent(null);
        } catch (error: any) {
            console.error('Failed to save agent:', error);
            toast.error(error.message || 'Failed to save AI unit. Please try again.');
            window.alert(error.message || 'Failed to save AI unit. Please try again.');
        }
    };

    const handleDeleteAgent = async (id: string) => {
        try {
            await MindGridService.delete(id);
            await loadAgents();
        } catch (error) {
            console.error('Failed to delete agent:', error);
        }
    };

    const filteredAgents = agents.filter(a => activeFilter === 'All' || a.platform === activeFilter);

    const PLATFORM_CONFIG = {
        openai: {
            label: 'OpenAI',
            tag: 'GPT',
            styles: "bg-emerald-50 text-emerald-600 border-emerald-100",
            iconBg: "bg-emerald-600",
            icon: null
        },
        google: {
            label: 'Google',
            tag: 'GEM',
            styles: "bg-blue-50 text-blue-600 border-blue-100",
            iconBg: "bg-blue-600",
            icon: null
        },
        other: {
            label: 'Others',
            tag: null,
            styles: "bg-indigo-50 text-indigo-600 border-indigo-100",
            iconBg: null,
            icon: <Icons.LayoutGrid size={14} className="text-indigo-600" />
        }
    };

    const getPlatformBadge = (platform: Agent['platform']) => {
        const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.other;
        return (
            <div className={cn("absolute top-8 right-8 px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest flex items-center gap-2", config.styles)}>
                {config.tag && (
                    <div className={cn("px-1.5 h-5 rounded flex items-center justify-center text-[9px] text-white font-black leading-none", config.iconBg)}>
                        {config.tag}
                    </div>
                )}
                {config.icon}
                {config.label}
            </div>
        );
    };

    return (
        <WebAppShell>
            <AddAgentModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingAgent(null);
                }}
                onSave={handleSaveAgent}
                initialData={editingAgent}
            />

            <div className="max-w-[1400px] mx-auto p-4 animate-in fade-in duration-500">
                {/* Standardized Header */}
                <div className="flex items-center justify-between gap-2 md:gap-4 mb-8 md:mb-12">
                    <div className="space-y-1 md:space-y-2">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-2 md:gap-4">
                            MindGrid
                        </h1>
                        <p className="text-gray-400 font-medium max-w-xl text-xs md:text-base hidden sm:block">
                            Deploy specialized AI units to enhance your research and productivity.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingAgent(null);
                            setShowAddModal(true);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 md:px-6 md:py-4 bg-gray-900 text-white rounded-xl md:rounded-[24px] font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-gray-200 hover:scale-[1.02] transition-all active:scale-95 shrink-0"
                    >
                        <Icons.Plus size={16} className="md:hidden" />
                        <Icons.Plus size={18} className="hidden md:block" />
                        <span className="hidden sm:inline">Sync New Intelligence</span>
                        <span className="sm:hidden">Sync</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
                    {['All', 'openai', 'google', 'other'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as any)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border shrink-0",
                                activeFilter === filter
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-105"
                                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                            )}
                        >
                            {filter === 'All' ? 'Full Grid' : (PLATFORM_CONFIG[filter as keyof typeof PLATFORM_CONFIG]?.label || filter)}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-gray-400 gap-6">
                        <Icons.Loader2 size={48} className="animate-spin text-indigo-600 mb-2" />
                        <div className="text-center space-y-1">
                            <p className="font-black uppercase tracking-[0.3em] text-[10px] text-gray-900">Syncing MindGrid</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bridging Neural Interface...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 pb-20">
                        {filteredAgents.map((agent) => (
                            <div
                                key={agent.id}
                                className="group relative bg-white border border-gray-100 p-8 rounded-[40px] transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
                            >
                                {/* Platform Badge */}
                                {getPlatformBadge(agent.platform)}

                                {/* Category */}
                                <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">
                                    {agent.category}
                                </span>

                                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                    {agent.name}
                                </h3>

                                <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
                                    {agent.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <a
                                        href={agent.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-xs font-black text-indigo-600 uppercase tracking-widest gap-2 bg-indigo-50 px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group/btn"
                                    >
                                        Initialize Unit
                                        <Icons.ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                    </a>

                                    {!agent.is_default && agent.user_id === currentUser?.id && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingAgent(agent);
                                                    setShowAddModal(true);
                                                }}
                                                className="p-3 text-gray-300 hover:text-indigo-500 transition-colors rounded-xl hover:bg-indigo-50"
                                                title="Edit Unit"
                                            >
                                                <Icons.PenLine size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAgent(agent.id)}
                                                className="p-3 text-gray-300 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
                                                title="Unregister Unit"
                                            >
                                                <Icons.Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Background decoration */}
                                <div className="absolute -bottom-6 -right-6 text-gray-50 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none">
                                    <Icons.LayoutGrid size={160} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </WebAppShell>
    );
}
