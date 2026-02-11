"use client"

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/shared/Dialog"
import { Button } from "@/components/shared/Button"
import { Icons } from "@/components/shared/Icons"
import { cn } from "@/lib/utils"

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: 'primary' | 'danger'
    isLoading?: boolean
    icon?: keyof typeof Icons
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
    isLoading = false,
    icon
}: ConfirmationModalProps) {
    const IconComponent = icon ? Icons[icon] : null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    {icon && (
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border shadow-sm",
                            variant === 'danger' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                            {IconComponent && <IconComponent size={24} />}
                        </div>
                    )}
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="mt-2 text-sm text-gray-500 font-medium normal-case tracking-normal">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 mt-6">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-2xl flex-1 md:flex-none"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-2xl flex-1 md:flex-none px-8"
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
