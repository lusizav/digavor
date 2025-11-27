import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner Component
 * Displays an animated loading indicator
 */
export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
            {text && (
                <p className="text-slate-600 text-sm font-medium">{text}</p>
            )}
        </div>
    );
}
