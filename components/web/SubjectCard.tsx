"use client"

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Subject } from '@/types';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
    subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
    const IconComponent = (Icons as any)[subject.icon];
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = (e: React.MouseEvent, action: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMenuOpen(false);
        // Placeholder for actual implementation
        console.log(`${action} subject ${subject.id}`);
        alert(`${action} feature coming soon for ${subject.title}!`);
    };

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
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform duration-300 overflow-hidden shrink-0"
                        style={{ backgroundColor: subject.color }}
                    >
                        {IconComponent ? (
                            <IconComponent size={28} />
                        ) : (
                            <span className="text-2xl">{subject.icon}</span>
                        )}
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className={cn(
                                "p-2 rounded-xl transition-all active:scale-95",
                                isMenuOpen ? "text-blue-600 bg-blue-50" : "text-gray-300 hover:text-blue-600 hover:bg-blue-50"
                            )}
                        >
                            <Icons.MoreVertical size={20} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 z-20">
                                {[
                                    { label: 'Add Unit', icon: Icons.PlusCircle, color: 'text-blue-600' },
                                    { label: 'Edit', icon: Icons.Edit, color: 'text-gray-600' },
                                    { label: 'Remove', icon: Icons.Trash2, color: 'text-red-500' }
                                ].map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => handleAction(e, opt.label)}
                                        className="w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <opt.icon size={14} className={opt.color} />
                                        <span className={opt.color}>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{subject.title}</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[2.5rem]">{subject.description}</p>
                </div>

                <div className="space-y-4 mt-auto">
                    <ProgressBar value={subject.progress} color={subject.color} />
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{subject.unitCount} Units</span>
                        <span>{subject.progress}% Complete</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
