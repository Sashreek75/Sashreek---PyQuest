import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ProgressBar = ({
    value = 0,
    max = 100,
    className,
    showLabel = false,
    label,
    size = 'md',
    color = 'primary'
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizes = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4'
    };

    const colors = {
        primary: 'bg-gradient-to-r from-violet-600 to-indigo-600',
        success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        warning: 'bg-gradient-to-r from-orange-500 to-amber-500'
    };

    // Fallback to primary if color not found (prevents silent failures)
    const colorClass = colors[color] || colors.primary;

    return (
        <div className={twMerge(clsx("w-full", className))}>
            {showLabel && (
                <div className="flex justify-between text-xs mb-1 font-medium text-muted-foreground">
                    <span>{label}</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={clsx("w-full bg-secondary/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5", sizes[size])}>
                <div
                    className={clsx("h-full transition-all duration-1000 ease-out rounded-full", colorClass)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
