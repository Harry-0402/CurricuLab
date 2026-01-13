"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export function Switch({ checked, onChange, className }: SwitchProps) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                checked ? "bg-blue-600" : "bg-gray-200",
                className
            )}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-300",
                    checked ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    );
}
