"use client"

import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

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
            className={cn(
                "bg-white border border-gray-100 transition-all duration-300 group cursor-pointer relative",
                // Mobile: horizontal row
                "flex rounded-2xl hover:border-blue-200 hover:shadow-sm",
                // sm+: full vertical card
                "sm:flex-col sm:p-8 sm:rounded-[35px] sm:shadow-sm sm:hover:shadow-xl sm:hover:shadow-blue-500/5"
            )}
        >
            {/* Unit number badge — left strip on mobile, top-left on desktop */}
            <div className={cn(
                "flex items-center justify-center font-black text-blue-600 bg-gray-50 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300",
                // Mobile: left column
                "w-14 rounded-l-2xl text-base",
                // sm+: square icon top
                "sm:w-14 sm:h-14 sm:rounded-2xl sm:mb-6 sm:shadow-sm sm:text-xl"
            )}>
                U{unit.order}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 p-3.5 sm:p-0 flex flex-col justify-center sm:justify-start gap-1 sm:gap-0">
                <h3 className="text-sm sm:text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 sm:mb-2">
                    {unit.title}
                </h3>

                {unit.description && (
                    <p className="text-xs sm:text-sm font-bold text-gray-400 leading-relaxed line-clamp-1 sm:line-clamp-2 sm:mb-4">
                        {unit.description}
                    </p>
                )}

                {/* Topic list — only shown on desktop */}
                {parsedTopics.length > 0 && (
                    <div className="hidden sm:block pt-2">
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

                {/* Mobile: compact topic count */}
                {parsedTopics.length > 0 && (
                    <span className="sm:hidden text-[10px] font-bold text-gray-400">
                        {parsedTopics.length} topic{parsedTopics.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Edit button (admin) — desktop only visible on hover */}
            {onEditTopics && (
                <div className="hidden sm:flex absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditTopics(unit);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors z-10"
                        title="Edit Topics"
                    >
                        <Icons.Edit size={16} />
                    </button>
                </div>
            )}

            {/* Mobile: right chevron */}
            <div className="sm:hidden flex items-center pr-4 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0">
                <Icons.ChevronRight size={16} />
            </div>
        </div>
    );
}
