"use client"

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => setIsVisible(true));

        // Auto dismiss after 3 seconds
        const timer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => onRemove(toast.id), 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    return (
        <div
            className={cn(
                "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border transition-all duration-300 min-w-[280px]",
                toast.type === 'success' && "bg-green-50 border-green-200 text-green-800",
                toast.type === 'error' && "bg-red-50 border-red-200 text-red-800",
                toast.type === 'info' && "bg-blue-50 border-blue-200 text-blue-800",
                isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            )}
        >
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                toast.type === 'success' && "bg-green-200 text-green-600",
                toast.type === 'error' && "bg-red-200 text-red-600",
                toast.type === 'info' && "bg-blue-200 text-blue-600"
            )}>
                {toast.type === 'success' && <Icons.Check size={16} />}
                {toast.type === 'error' && <Icons.X size={16} />}
                {toast.type === 'info' && <Icons.Info size={16} />}
            </div>
            <span className="text-sm font-bold">{toast.message}</span>
            <button
                onClick={() => {
                    setIsLeaving(true);
                    setTimeout(() => onRemove(toast.id), 300);
                }}
                className="ml-auto p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
                <Icons.X size={14} />
            </button>
        </div>
    );
}
