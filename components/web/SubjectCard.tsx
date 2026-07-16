"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { Subject } from '@/types';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
    subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
    // ... (keep robust icon lookup) ...
    let IconComponent = (Icons as any)[subject.icon];
    let displayIcon = subject.icon;

    // Map common "dirty" data keys to Emojis (User Preference)
    const lowerIcon = subject.icon.toLowerCase();

    // Primary mappings
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

    // Fallback if no icon and no emoji mapping found
    if (!IconComponent && displayIcon.length > 4 && displayIcon === subject.icon) {
        displayIcon = '📚';
    }



    return (
        <Link href={`/subject/${subject.id}`} className="block group h-full">
            <div
                className="p-6 rounded-[32px] border shadow-sm group-hover:shadow-md transition-all duration-500 h-full flex flex-col"
                style={{
                    backgroundColor: `${subject.color}08`, // ~3% opacity tint
                    borderColor: `${subject.color}20`  // ~12% opacity border
                }}
            >
                <div className="flex items-start justify-between mb-6">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 overflow-hidden shrink-0"
                        style={{
                            backgroundColor: `${subject.color}25`,
                            color: subject.color
                        }}
                    >
                        {IconComponent ? (
                            <IconComponent size={28} />
                        ) : (
                            <span className="text-2xl select-none" role="img" aria-label="subject-icon">{displayIcon}</span>
                        )}
                    </div>


                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{subject.title}</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[2.5rem]">
                        {subject.description || <span className="italic opacity-50">Faculty is not assigned</span>}
                    </p>
                </div>

                <div className="space-y-4 mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{subject.unitCount} Units Available</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
