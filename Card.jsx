import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={twMerge(clsx("glass-card rounded-xl text-card-foreground p-6", className))}
        {...props}
    >
        {children}
    </div>
));

Card.displayName = "Card";

export default Card;
