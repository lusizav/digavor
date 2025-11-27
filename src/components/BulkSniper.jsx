import React, { useState } from 'react';
import { Target, Upload, CheckCircle, Copy, Zap, TrendingDown, Clock } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { calculateDomainValue } from '../utils/valuationAlgorithm';
import { checkAvailability, mockCheckAvailability } from '../utils/rdapChecker';

/**
 * Bulk Sniper Component
 * Analyze domain lists with instant valuation and availability checking
 */
export default function BulkSniper() {
    const [domainList, setDomainList] = useState('');
    const [results, setResults] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [checking, setChecking] = useState(false);
    const [checkedCount, setCheckedCount] = useState(0);

    /**
     * Analyze pasted domain list
     */
    const handleAnalyze = () => {
        if (!domainList.trim()) return;

        setAnalyzing(true);

        // Split by newlines and clean up
        const domains = domainList
            .split('\n')
            .map(d => d.trim())
            .filter(d => d.length > 0 && d.includes('.'));

        // Run instant valuation on all domains
        const analyzed = domains.map((domain, index) => {
            const valuation = calculateDomainValue(domain);
            const baseName = domain.split('.')[0];

            return {
                rank: index + 1, // Will re-rank after sorting
                domain,
                value: valuation.value,
                length: baseName.length,
                status: 'unknown',
                available: null,
            };
        });

        // Sort by value (highest to lowest)
        analyzed.sort((a, b) => b.value - a.value);

        // Re-assign ranks after sorting
        analyzed.forEach((item, index) => {
            item.rank = index + 1;
        });

        setResults(analyzed);
        setAnalyzing(false);
    };

    /**
     * Check availability for top 10 domains (rate-limited)
     */
    const handleCheckTop10 = async () => {
        if (results.length === 0) return;

        setChecking(true);
        setCheckedCount(0);

        const top10 = results.slice(0, 10);

        for (let i = 0; i < top10.length; i++) {
            const domain = top10[i];

            try {
                // Try RDAP, fallback to mock
                let availabilityResult;
                try {
                    availabilityResult = await checkAvailability(domain.domain);
                } catch (error) {
                    availabilityResult = await mockCheckAvailability(domain.domain);
                }

                // Update the specific domain in results
                setResults(prevResults => {
                    const updated = [...prevResults];
                    const index = updated.findIndex(d => d.domain === domain.domain);
                    if (index !== -1) {
                        updated[index] = {
                            ...updated[index],
                            status: availabilityResult.status,
                            available: availabilityResult.available,
                        };
                    }
                    return updated;
                });

                setCheckedCount(i + 1);

                // Rate limiting: 500ms delay between requests
                if (i < top10.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch (error) {
                console.error(`Error checking ${domain.domain}:`, error);
            }
        }

        setChecking(false);
    };

    /**
     * Copy available domains to clipboard
     */
    const handleCopyAvailable = () => {
        const available = results
            .filter(d => d.status === 'available')
            .map(d => d.domain)
            .join('\n');

        if (available) {
            navigator.clipboard.writeText(available);
            alert(`Copied ${results.filter(d => d.status === 'available').length} available domains!`);
        } else {
            alert('No available domains to copy');
        }
    };

    /**
     * Get status badge configuration
     */
    const getStatusConfig = (status) => {
        const configs = {
            available: { label: 'Available', className: 'badge-success', icon: CheckCircle },
            taken: { label: 'Taken', className: 'badge-danger', icon: TrendingDown },
            unknown: { label: 'Unknown', className: 'bg-slate-100 text-slate-600', icon: Clock },
        };
        return configs[status] || configs.unknown;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900">Bulk Sniper</h1>
                    <p className="text-slate-600 mt-1">
                        Analyze domain lists from ExpiredDomains.net - Find hidden gems instantly
                    </p>
                </div>
            </div>

            {/* Input Section */}
            <div className="card p-8 mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Paste Domain List (one per line)
                </label>
                <textarea
                    value={domainList}
                    onChange={(e) => setDomainList(e.target.value)}
                    placeholder="example.com&#10;bestdomain.net&#10;techstartup.io&#10;...paste your list here"
                    className="w-full h-64 px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-200 font-mono text-sm resize-none"
                />

                <div className="flex flex-wrap gap-3 mt-4">
                    <button
                        onClick={handleAnalyze}
                        disabled={!domainList.trim() || analyzing}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Zap className="w-4 h-4" />
                        {analyzing ? 'Analyzing...' : 'Analyze Value'}
                    </button>

                    {results.length > 0 && (
                        <>
                            <button
                                onClick={handleCheckTop10}
                                disabled={checking}
                                className="btn bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {checking ? `Checking... (${checkedCount}/10)` : 'Check Top 10'}
                            </button>

                            <button
                                onClick={handleCopyAvailable}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Available
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Results Section */}
            {analyzing && (
                <div className="card p-12">
                    <LoadingSpinner size="lg" text="Analyzing domains..." />
                </div>
            )}

            {!analyzing && results.length > 0 && (
                <div className="card p-6 animate-fade-in">
                    {/* Stats Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-200">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {results.length} Domains Analyzed
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Sorted by estimated value (highest first)
                            </p>
                        </div>
                        {checkedCount > 0 && (
                            <div className="text-sm text-slate-600">
                                <span className="font-semibold text-green-600">
                                    {results.filter(d => d.status === 'available').length} Available
                                </span>
                                {' / '}
                                <span className="font-semibold text-red-600">
                                    {results.filter(d => d.status === 'taken').length} Taken
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Rank
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Domain
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Est. Value
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Length
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((domain) => {
                                    const statusConfig = getStatusConfig(domain.status);
                                    const StatusIcon = statusConfig.icon;
                                    const isHighValue = domain.value > 1000;

                                    return (
                                        <tr
                                            key={domain.domain}
                                            className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${isHighValue ? 'bg-yellow-50/50' : ''
                                                }`}
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-slate-700">
                                                        #{domain.rank}
                                                    </span>
                                                    {domain.rank <= 3 && (
                                                        <span className="text-yellow-500">⭐</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-semibold text-slate-900">
                                                    {domain.domain}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`text-lg font-bold ${isHighValue ? 'text-yellow-600' : 'text-primary-700'}`}>
                                                    ${domain.value.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-slate-600">
                                                    {domain.length} chars
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`flex items-center gap-1.5 ${statusConfig.className} w-fit`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {statusConfig.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                {domain.status === 'available' ? (
                                                    <a
                                                        href={`https://www.namecheap.com/domains/registration/results/?domain=${domain.domain}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-gradient-to-r from-success-500 to-success-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all inline-block"
                                                    >
                                                        Register
                                                    </a>
                                                ) : domain.status === 'unknown' ? (
                                                    <span className="text-sm text-slate-400">
                                                        Not checked
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-slate-400">
                                                        Unavailable
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-900 flex items-center gap-2">
                            <span className="text-yellow-500">✨</span>
                            <strong>Pro Tip:</strong> Domains highlighted in gold are valued over $1,000.
                            Top 3 domains are marked with a star ⭐
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
