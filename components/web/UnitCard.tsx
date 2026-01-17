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
                    {unit.isCompleted && (
                        <div className="bg-green-50 text-green-600 p-2 rounded-full border border-green-100">
                            <Icons.CheckSquare size={20} />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-2">{unit.title}</h3>
                </div>
                <p className="text-sm font-bold text-gray-400 leading-relaxed mb-4">{unit.description}</p>

                {unit.topics && unit.topics.length > 0 && (
                    <div className="pt-2">
                        <ul className="space-y-3">
                            {unit.topics.slice(0, 4).map((topic, i) => (
                                <li key={i} className="flex items-start gap-3 text-[11px] font-bold text-gray-500 group/item">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1 group-hover:scale-150 transition-transform shrink-0" />
                                    <span className="leading-tight">{topic}</span>
                                </li>
                            ))}
                            {unit.topics.length > 4 && (
                                <li className="text-[10px] font-bold text-blue-500 pl-4">
                                    + {unit.topics.length - 4} more topics...
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
