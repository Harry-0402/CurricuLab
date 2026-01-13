import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
            secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
            outline: 'border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700',
            ghost: 'hover:bg-gray-100 text-gray-600',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
            icon: 'p-2',
        }

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
