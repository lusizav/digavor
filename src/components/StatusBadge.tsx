import React from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: 'available' | 'taken' | 'unknown';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = {
        available: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            icon: CheckCircle2,
            label: 'Available'
        },
        taken: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            icon: XCircle,
            label: 'Taken'
        },
        unknown: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            icon: HelpCircle,
            label: 'Unknown'
        }
    };

    const { bg, text, icon: Icon, label } = config[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
            <Icon size={14} />
            {label}
        </span>
    );
};

export default StatusBadge;
