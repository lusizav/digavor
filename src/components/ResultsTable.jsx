import React from 'react';
import DomainCard from './DomainCard';
import LoadingSpinner from './LoadingSpinner';
import { Search } from 'lucide-react';

/**
 * Results Table Component
 * Displays the list of generated domains with their status and value
 */
export default function ResultsTable({ domains, loading, keyword }) {
    // Show loading state
    if (loading && domains.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="card p-12">
                    <LoadingSpinner size="lg" text="Generating domain variations..." />
                </div>
            </div>
        );
    }

    // Show empty state
    if (!loading && domains.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="card p-12 text-center">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">
                        No Domains Generated Yet
                    </h3>
                    <p className="text-slate-500">
                        Enter a keyword above to start discovering available domains
                    </p>
                </div>
            </div>
        );
    }

    // Calculate statistics
    const availableCount = domains.filter(d => d.status === 'available').length;
    const takenCount = domains.filter(d => d.status === 'taken').length;
    const checkingCount = domains.filter(d => d.status === 'checking').length;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header with stats */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    Results for "{keyword}"
                </h2>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">Total:</span>
                        <span className="badge bg-slate-100 text-slate-700">{domains.length} domains</span>
                    </div>
                    {availableCount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-success-700">Available:</span>
                            <span className="badge-success">{availableCount}</span>
                        </div>
                    )}
                    {takenCount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-danger-700">Taken:</span>
                            <span className="badge-danger">{takenCount}</span>
                        </div>
                    )}
                    {checkingCount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-yellow-700">Checking:</span>
                            <span className="badge-warning">{checkingCount}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Domain Cards Grid */}
            <div className="space-y-4 animate-fade-in">
                {domains.map((domain, index) => (
                    <div
                        key={domain.name}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <DomainCard domain={domain} />
                    </div>
                ))}
            </div>

            {/* Loading indicator at bottom if still checking */}
            {checkingCount > 0 && (
                <div className="mt-8 text-center">
                    <LoadingSpinner size="sm" text={`Checking ${checkingCount} domains...`} />
                </div>
            )}
        </div>
    );
}
