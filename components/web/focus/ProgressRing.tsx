"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    isDarkMode?: boolean;
}

export function ProgressRing({ progress, size = 300, strokeWidth = 8, isDarkMode = false }: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    // Color based on progress (green -> yellow -> red)
    const getColor = () => {
        if (progress > 66) return isDarkMode ? '#10B981' : '#22C55E'; // Green
        if (progress > 33) return isDarkMode ? '#F59E0B' : '#EAB308'; // Yellow
        return isDarkMode ? '#EF4444' : '#F87171'; // Red
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={isDarkMode ? '#374151' : '#E5E7EB'}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-in-out"
                />
            </svg>
        </div>
    );
}
