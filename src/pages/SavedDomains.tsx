import React from 'react';
import { Heart, ExternalLink, Trash2, Download } from 'lucide-react';
import { getSavedDomains, clearAllSavedDomains, exportSavedDomainsToCSV, removeSavedDomain } from '../utils/savedDomains';
import { getAffiliateLink } from '../utils/domainLogic';

const SavedDomains: React.FC = () => {
    const [savedDomains, setSavedDomains] = React.useState(getSavedDomains());

    // Refresh saved domains list
    const refreshList = () => {
        setSavedDomains(getSavedDomains());
    };

    const handleRemove = (domain: string) => {
        removeSavedDomain(domain);
        refreshList();
    };

    const handleClearAll = () => {
        if (savedDomains.length === 0) return;

        if (window.confirm(`Are you sure you want to remove all ${savedDomains.length} saved domains?`)) {
            clearAllSavedDomains();
            refreshList();
        }
    };

    const handleExport = () => {
        exportSavedDomainsToCSV();
    };

    const handleBuyClick = (domain: string) => {
        window.open(getAffiliateLink(domain), '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Heart className="text-red-500 fill-red-500" size={48} />
                    <h1 className="text-4xl font-bold text-gray-900">
                        Saved Domains
                    </h1>
                </div>
                <p className="text-lg text-gray-600">
                    Your personal watchlist of favorite domains. {savedDomains.length} {savedDomains.length === 1 ? 'domain' : 'domains'} saved.
                </p>
            </div>

            {/* Actions Bar */}
            {savedDomains.length > 0 && (
                <div className="mb-6 flex gap-3">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <Download size={16} />
                        Export to CSV
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Clear All
                    </button>
                </div>
            )}

            {/* Saved Domains List */}
            {savedDomains.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Heart className="text-gray-300 mx-auto mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Saved Domains Yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Click the heart icon on any domain card to add it to your watchlist
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Domain
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Estimated Value
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Saved Date
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {savedDomains.map((item, index) => (
                                <tr key={`${item.domain}-${index}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Heart className="text-red-500 fill-red-500 flex-shrink-0" size={16} />
                                            <span className="text-sm font-medium text-gray-900">
                                                {item.domain}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-primary-700">
                                        ${(item.value || 0).toLocaleString('en-US')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(item.savedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleBuyClick(item.domain)}
                                                className="px-3 py-1.5 text-sm bg-primary-700 text-white rounded hover:bg-primary-800 transition-colors flex items-center gap-1"
                                            >
                                                <ExternalLink size={14} />
                                                Buy
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.domain)}
                                                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SavedDomains;
