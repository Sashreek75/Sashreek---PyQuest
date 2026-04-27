import React from 'react';
import { Flame } from 'lucide-react';
import { clsx } from 'clsx';

const StreakCounter = ({ streak, className }) => {
    return (
        <div className={clsx("flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20", className)}>
            <div className="relative mb-2">
                <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 animate-pulse"></div>
                <Flame className={clsx("text-orange-500", streak > 0 ? "animate-bounce" : "text-muted-foreground")} size={32} />
            </div>
            <span className="text-2xl font-bold text-white">{streak}</span>
            <span className="text-xs text-orange-200/60 uppercase tracking-widest font-semibold">Day Streak</span>
        </div>
    );
};

export default StreakCounter;
