"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/Icons';

interface KPIStatCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: keyof typeof Icons;
    color: string;
}

export function KPIStatCard({ label, value, subValue, icon, color }: KPIStatCardProps) {
    const Icon = Icons[icon];

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-md transition-all duration-300">
            <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {subValue && <span className="text-xs font-medium text-gray-500">{subValue}</span>}
                </div>
            </div>
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: `${color}15`, color: color }}
            >
                <Icon size={24} />
            </div>
        </div>
    );
}
