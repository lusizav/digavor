import React, { useState } from 'react';

interface ToastProps {
    message: string;
    visible: boolean;
}

let toastTimeout: NodeJS.Timeout | null = null;

export const useToast = () => {
    const [toast, setToast] = useState<ToastProps>({ message: '', visible: false });

    const showToast = (message: string, duration: number = 3000) => {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        setToast({ message, visible: true });

        toastTimeout = setTimeout(() => {
            setToast({ message: '', visible: false });
        }, duration);
    };

    return { toast, showToast };
};

export const Toast: React.FC<ToastProps> = ({ message, visible }) => {
    if (!visible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
};
