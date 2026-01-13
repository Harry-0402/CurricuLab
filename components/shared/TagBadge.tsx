import { cn } from "@/lib/utils";

interface TagBadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'important' | 'exam' | 'weak' | 'success';
}

export function TagBadge({ children, className, variant = 'default' }: TagBadgeProps) {
    const variants = {
        default: 'bg-gray-100 text-gray-600',
        important: 'bg-red-100 text-red-600',
        exam: 'bg-purple-100 text-purple-600',
        weak: 'bg-orange-100 text-orange-600',
        success: 'bg-green-100 text-green-600',
    };

    return (
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider", variants[variant], className)}>
            {children}
        </span>
    );
}
