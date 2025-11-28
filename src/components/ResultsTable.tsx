import React, { useState } from 'react';
import { ArrowUpDown, ExternalLink, Loader2, History, TrendingUp, Scale, FileSearch } from 'lucide-react';
import StatusBadge from './StatusBadge';
import {
    getAffiliateLink,
    getWaybackMachineLink,
    getGoogleTrendsLink,
    getTrademarkCheckLink,
    getWhoisLink
} from '../utils/domainLogic';

interface DomainData {
    domain: string;
    value: number;
    status?: 'available' | 'taken' | 'unknown';
}

interface ResultsTableProps {
    domains: DomainData[];
    onCheckAvailability?: (domain: string, index: number) => void;
    loading?: boolean;
}

type SortField = 'domain' | 'value' | 'status';
type SortDirection = 'asc' | 'desc';

const ResultsTable: React.FC<ResultsTableProps> = ({
    domains,
    onCheckAvailability,
    loading = false
}) => {
    const [sortField, setSortField] = useState<SortField>('value');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedDomains = [...domains].sort((a, b) => {
        let comparison = 0;

        if (sortField === 'domain') {
            comparison = a.domain.localeCompare(b.domain);
        } else if (sortField === 'value') {
            comparison = (a.value || 0) - (b.value || 0);
        } else if (sortField === 'status') {
            const statusA = a.status || 'unknown';
            const statusB = b.status || 'unknown';
            comparison = statusA.localeCompare(statusB);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const handleBuyClick = (domain: string) => {
        window.open(getAffiliateLink(domain), '_blank', 'noopener,noreferrer');
    };

    const openIntelligenceTool = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (domains.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No domains to display
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('domain')}
                        >
                            <div className="flex items-center gap-2">
                                Domain
                                <ArrowUpDown size={16} className="text-gray-400" />
                            </div>
                        </th>
                        <th
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('value')}
                        >
                            <div className="flex items-center gap-2">
                                Estimated Value
                                <ArrowUpDown size={16} className="text-gray-400" />
                            </div>
                        </th>
                        <th
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center gap-2">
                                Status
                                <ArrowUpDown size={16} className="text-gray-400" />
                            </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sortedDomains.map((domainData, index) => (
                        <tr key={`${domainData.domain}-${index}`} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                        {domainData.domain}
                                    </span>
                                    {/* Intelligence Toolbar - Compact for table */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openIntelligenceTool(getWaybackMachineLink(domainData.domain))}
                                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Check Domain History (Spam Check)"
                                        >
                                            <History size={14} />
                                        </button>
                                        <button
                                            onClick={() => openIntelligenceTool(getGoogleTrendsLink(domainData.domain))}
                                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Check Keyword Popularity"
                                        >
                                            <TrendingUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => openIntelligenceTool(getTrademarkCheckLink(domainData.domain))}
                                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Check Trademarks"
                                        >
                                            <Scale size={14} />
                                        </button>
                                        <button
                                            onClick={() => openIntelligenceTool(getWhoisLink(domainData.domain))}
                                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Verify Ownership"
                                        >
                                            <FileSearch size={14} />
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-primary-700">
                                ${(domainData.value || 0).toLocaleString('en-US')}
                            </td>
                            <td className="px-6 py-4">
                                {domainData.status ? (
                                    <StatusBadge status={domainData.status} />
                                ) : (
                                    <span className="text-sm text-gray-400">Not checked</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    {onCheckAvailability && !domainData.status && (
                                        <button
                                            onClick={() => onCheckAvailability(domainData.domain, index)}
                                            disabled={loading}
                                            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                            {loading ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                'Check'
                                            )}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleBuyClick(domainData.domain)}
                                        className="px-3 py-1.5 text-sm bg-primary-700 text-white rounded hover:bg-primary-800 transition-colors flex items-center gap-1"
                                    >
                                        <ExternalLink size={14} />
                                        Buy
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;

