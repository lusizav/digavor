import React from 'react';
import { ExternalLink, Check, X, AlertCircle } from 'lucide-react';

/**
 * Domain Card Component
 * Displays individual domain with status, value, and action button
 */
export default function DomainCard({ domain }) {
    const { name, status, value, loading } = domain;

    // Status badge configuration
    const statusConfig = {
        available: {
            icon: Check,
            label: 'Available',
            className: 'badge-success',
            borderClass: 'border-success-200',
        },
        taken: {
            icon: X,
            label: 'Taken',
            className: 'badge-danger',
            borderClass: 'border-danger-200',
        },
        checking: {
            icon: AlertCircle,
            label: 'Checking...',
            className: 'badge-warning animate-pulse',
            borderClass: 'border-yellow-200',
        },
        error: {
            icon: AlertCircle,
            label: 'Error',
            className: 'bg-slate-100 text-slate-600',
            borderClass: 'border-slate-200',
        },
    };

    const config = statusConfig[status] || statusConfig.checking;
    const Icon = config.icon;

    // Namecheap purchase URL
    const namecheapUrl = `https://www.namecheap.com/domains/registration/results/?domain=${name}`;

    return (
        <div className={`card border-l-4 ${config.borderClass} p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Domain Name */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 truncate mb-2">
                        {name}
                    </h3>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 ${config.className}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* Valuation */}
                <div className="text-center sm:text-right">
                    {loading ? (
                        <div className="animate-pulse">
                            <div className="h-4 w-24 bg-slate-200 rounded mb-1"></div>
                            <div className="h-6 w-20 bg-slate-200 rounded"></div>
                        </div>
                    ) : (
                        <>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                                Est. Value
                            </div>
                            <div className="text-2xl font-bold text-primary-700">
                                ${value.toLocaleString()}
                            </div>
                        </>
                    )}
                </div>

                {/* Action Button */}
                <div>
                    {status === 'available' ? (
                        <a
                            href={namecheapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-success flex items-center gap-2 whitespace-nowrap"
                        >
                            Buy on Namecheap
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    ) : status === 'taken' ? (
                        <a
                            href={namecheapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary flex items-center gap-2 whitespace-nowrap opacity-60"
                        >
                            View Details
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    ) : (
                        <button
                            disabled
                            className="btn-secondary opacity-40 cursor-not-allowed"
                        >
                            {loading ? 'Checking...' : 'Unavailable'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
