import { cn } from "@/lib/utils";

interface ProgressBarProps {
    value: number; // 0 to 100
    className?: string;
    color?: string;
    showLabel?: boolean;
}

export function ProgressBar({ value, className, color = "#3b82f6", showLabel = false }: ProgressBarProps) {
    return (
        <div className={cn("w-full space-y-1.5", className)}>
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                {showLabel && <span>Progress</span>}
                {showLabel && <span>{Math.round(value)}%</span>}
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                    className="h-full transition-all duration-500 ease-out rounded-full"
                    style={{
                        width: `${value}%`,
                        background: `linear-gradient(90deg, ${color}dd, ${color})`,
                        boxShadow: `0 0 8px ${color}40`
                    }}
                />
            </div>
        </div>
    );
}
