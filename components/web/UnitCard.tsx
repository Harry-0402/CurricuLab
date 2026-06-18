"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';

interface UnitCardProps {
    unit: {
        id: string;
        title: string;
        description: string;
        order: number;
        isCompleted: boolean;
        topics?: string[];
    };
    onEditTopics?: (unit: any) => void;
    onViewTopics?: (unit: any) => void;
}

export function UnitCard({ unit, onEditTopics, onViewTopics }: UnitCardProps) {
    const parsedTopics: { title: string, subtopics: string[] }[] = [];
    let currentTopic: { title: string, subtopics: string[] } | null = null;
    
    for (const t of unit.topics || []) {
        if (/^[ \t]+-/.test(t)) {
            if (currentTopic) currentTopic.subtopics.push(t.replace(/^[ \t]+-[ \t]*/, ''));
        } else {
            const title = t.replace(/^-[ \t]*/, '');
            currentTopic = { title, subtopics: [] };
            parsedTopics.push(currentTopic);
        }
    }
    return (
        <div
            onClick={() => onViewTopics && onViewTopics(unit)}
            className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group flex flex-col relative cursor-pointer"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    U{unit.order}
                </div>
                <div className="flex items-center gap-2">
                    {onEditTopics && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onEditTopics(unit);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-10"
                            title="Edit Topics"
                        >
                            <Icons.Edit size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">{unit.title}</h3>
                </div>
                {unit.description && (
                    <p className="text-sm font-bold text-gray-400 leading-relaxed mb-4 line-clamp-2">{unit.description}</p>
                )}

                {parsedTopics.length > 0 && (
                    <div className="pt-2">
                        <ul className="space-y-3">
                            {parsedTopics.slice(0, 3).map((topic, i) => (
                                <li key={i} className="flex flex-col gap-1 text-[11px] font-bold text-gray-500 group/item">
                                    <div className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1 group-hover:scale-150 transition-transform shrink-0" />
                                        <span className="leading-tight line-clamp-2">{topic.title}</span>
                                    </div>
                                    {topic.subtopics.length > 0 && (
                                        <ul className="pl-5 space-y-1 mt-1 border-l border-gray-100 ml-0.5">
                                            {topic.subtopics.slice(0, 2).map((sub, j) => (
                                                <li key={j} className="flex items-start gap-2 text-[10px] text-gray-400 font-medium">
                                                    <span className="shrink-0">-</span>
                                                    <span className="leading-tight line-clamp-1">{sub}</span>
                                                </li>
                                            ))}
                                            {topic.subtopics.length > 2 && (
                                                <li className="text-[9px] text-gray-300 pl-2">+ {topic.subtopics.length - 2} more</li>
                                            )}
                                        </ul>
                                    )}
                                </li>
                            ))}
                            {parsedTopics.length > 3 && (
                                <li className="text-[10px] font-bold text-blue-500 pl-4">
                                    + {parsedTopics.length - 3} more topics...
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
