"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';
import { useAuth } from '@/components/providers/AuthProvider';
import { Subject } from '@/types';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
    subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
    let IconComponent = (Icons as any)[subject.icon];
    let displayIcon = subject.icon;

    const lowerIcon = subject.icon.toLowerCase();

    if (lowerIcon.includes('rocket') || lowerIcon.includes('digital') || lowerIcon.includes('transform')) { displayIcon = '🚀'; IconComponent = null; }
    else if (lowerIcon.includes('factory') || lowerIcon.includes('truck') || lowerIcon.includes('product') || lowerIcon.includes('operations')) { displayIcon = '🏭'; IconComponent = null; }
    else if (lowerIcon.includes('scale') || lowerIcon.includes('law') || lowerIcon.includes('legal') || lowerIcon.includes('balance')) { displayIcon = '⚖️'; IconComponent = null; }
    else if (lowerIcon.includes('graph') || lowerIcon.includes('chart') || lowerIcon.includes('visual') || lowerIcon.includes('story')) { displayIcon = '📊'; IconComponent = null; }
    else if (lowerIcon.includes('search') || lowerIcon.includes('research') || lowerIcon.includes('magnif')) { displayIcon = '🔍'; IconComponent = null; }
    else if (lowerIcon.includes('python') || lowerIcon.includes('snake') || lowerIcon.includes('data analysis')) { displayIcon = '🐍'; IconComponent = null; }
    else if (lowerIcon.includes('power') || lowerIcon.includes('bi') || lowerIcon.includes('business intelligence')) { displayIcon = '📈'; IconComponent = null; }
    else if (lowerIcon.includes('chat') || lowerIcon.includes('communication') || lowerIcon.includes('talk')) { displayIcon = '💬'; IconComponent = null; }
    else if (lowerIcon.includes('robot') || lowerIcon.includes('bot') || lowerIcon.includes('ai')) { displayIcon = '🤖'; IconComponent = null; }
    else if (lowerIcon.includes('shop') || lowerIcon.includes('store') || lowerIcon.includes('market')) { displayIcon = '🛍️'; IconComponent = null; }

    if (!IconComponent && displayIcon.length > 4 && displayIcon === subject.icon) {
        displayIcon = '📚';
    }

    return (
        <Link href={`/subject/${subject.id}`} className="block group">
            <div
                className={cn(
                    "border transition-all duration-300 group-hover:shadow-md",
                    // Mobile: horizontal row
                    "flex rounded-2xl",
                    // sm+: vertical card
                    "sm:flex-col sm:rounded-[32px] sm:p-6 sm:h-full"
                )}
                style={{
                    backgroundColor: `${subject.color}08`,
                    borderColor: `${subject.color}20`,
                }}
            >
                {/* Icon */}
                <div
                    className={cn(
                        "flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden",
                        // Mobile: left square strip
                        "w-16 rounded-l-2xl",
                        // sm+: top icon box
                        "sm:w-14 sm:h-14 sm:rounded-2xl sm:mb-6 sm:shadow-sm"
                    )}
                    style={{
                        backgroundColor: `${subject.color}25`,
                        color: subject.color,
                    }}
                >
                    {IconComponent ? (
                        <IconComponent size={22} className="sm:w-7 sm:h-7" />
                    ) : (
                        <span className="text-xl sm:text-2xl select-none" role="img" aria-label="subject-icon">{displayIcon}</span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 p-3.5 sm:p-0 flex flex-col justify-center sm:justify-start">
                    <h3 className="text-sm sm:text-xl font-bold text-gray-900 line-clamp-2 sm:min-h-[3.5rem] group-hover:text-blue-600 transition-colors" style={{ color: undefined }}>
                        {subject.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-2 line-clamp-1 sm:line-clamp-2 sm:min-h-[2.5rem] hidden xs:block">
                        {subject.description || <span className="italic opacity-50">Faculty not assigned</span>}
                    </p>

                    <div className="hidden sm:flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 pt-4 border-t border-gray-50">
                        <span>{subject.unitCount} Units</span>
                        <Icons.ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    {/* Mobile-only unit count */}
                    <span className="sm:hidden text-[10px] font-bold text-gray-400 mt-1">{subject.unitCount} units</span>
                </div>

                {/* Mobile right arrow */}
                <div className="sm:hidden flex items-center pr-4 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0">
                    <Icons.ChevronRight size={16} />
                </div>
            </div>
        </Link>
    );
}
