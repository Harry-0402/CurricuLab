"use client"

import React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/Icons';

interface KPIStatCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon?: keyof typeof Icons;
    color?: string;
    trend?: {
        value: string;
        isPositive: boolean;
        label: string;
    };
    progress?: number;
}

export function KPIStatCard({ label, value, subValue, icon, color = '#4f46e5', trend, progress }: KPIStatCardProps) {
    const Icon = icon ? Icons[icon] : null;

    return (
        <div className="relative overflow-hidden bg-white p-3 md:p-6 rounded-2xl md:rounded-[32px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 min-h-[90px] md:min-h-[160px]">
            {/* Soft background glow */}
            <div 
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl transition-transform duration-700 group-hover:scale-150 pointer-events-none"
                style={{ backgroundColor: color }}
            />
            
            <div className="flex items-start justify-between w-full relative z-10 gap-2">
                <p className="text-[10px] md:text-sm font-bold text-gray-500 tracking-wide flex-1 break-words leading-[1.1] md:leading-tight">{label}</p>
                {Icon && (
                    <div
                        className="hidden md:flex w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{ 
                            backgroundColor: `${color}15`, 
                            color: color,
                        }}
                    >
                        <Icon size={22} strokeWidth={2.5} />
                    </div>
                )}
            </div>
            
            <div className="mt-auto pt-2 md:pt-4 relative z-10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-1 md:gap-2 shrink-0">
                        <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>{value}</h3>
                        {subValue && <span className="text-[9px] md:text-sm font-bold text-gray-400">{subValue}</span>}
                    </div>
                    
                    {/* Progress bar container (always renders to maintain consistent card height) */}
                    <div className="hidden md:block h-2 w-full">
                        {progress !== undefined && (
                            <div className="w-full bg-gray-50 rounded-full h-2 overflow-hidden border border-gray-100 shadow-inner">
                                <div 
                                    className="h-full rounded-full transition-all duration-1000 ease-out relative" 
                                    style={{ 
                                        width: `${progress}%`,
                                        backgroundColor: color,
                                        boxShadow: `0 0 10px ${color}60`
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {trend && (
                    <div className="flex items-center gap-2 mt-3">
                        <span className={cn(
                            "px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1",
                            trend.isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                        )}>
                            {trend.isPositive ? <Icons.ArrowUp size={12} strokeWidth={3} /> : <Icons.ArrowDown size={12} strokeWidth={3} />}
                            {trend.value}
                        </span>
                        <span className="text-xs font-bold text-gray-400">{trend.label}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
