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
}

export function UnitCard({ unit }: UnitCardProps) {
    return (
        <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group flex flex-col">
            <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    U{unit.order}
                </div>
                {unit.isCompleted && (
                    <div className="bg-green-50 text-green-600 p-2 rounded-full border border-green-100">
                        <Icons.CheckSquare size={20} />
                    </div>
                )}
            </div>

            <div className="space-y-4 flex-1">
                <Link href={`/unit/${unit.id}`}>
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-2">{unit.title}</h3>
                </Link>
                <p className="text-sm font-bold text-gray-400 leading-relaxed mb-4">{unit.description}</p>

                {unit.topics && unit.topics.length > 0 && (
                    <div className="pt-2">
                        <ul className="space-y-3">
                            {unit.topics.map((topic, i) => (
                                <li key={i} className="flex items-start gap-3 text-[11px] font-bold text-gray-500 group/item">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1 group-hover:scale-150 transition-transform shrink-0" />
                                    <span className="leading-tight">{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
