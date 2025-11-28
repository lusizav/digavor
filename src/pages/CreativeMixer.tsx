import React, { useState } from 'react';
import { Shuffle, Sparkles } from 'lucide-react';
import DomainCard from '../components/DomainCard';
import { calculateValue, checkAvailability } from '../utils/domainLogic';
import { TLDS } from '../utils/constants';

interface DomainResult {
    domain: string;
    value: number;
    status?: 'available' | 'taken' | 'unknown';
    loading?: boolean;
}

const CreativeMixer: React.FC = () => {
    const [prefix, setPrefix] = useState('');
    const [keyword, setKeyword] = useState('');
    const [suffix, setSuffix] = useState('');
    const [results, setResults] = useState<DomainResult[]>([]);

    const handleGenerate = () => {
        if (!keyword.trim()) {
            alert('Please enter at least a keyword');
            return;
        }

        const combinations: string[] = [];
        const cleanPrefix = prefix.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanKeyword = keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanSuffix = suffix.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

        // Generate all combinations with different TLDs
        TLDS.forEach(tld => {
            // Just keyword
            if (cleanKeyword) {
                combinations.push(`${cleanKeyword}${tld}`);
            }

            // Prefix + Keyword
            if (cleanPrefix && cleanKeyword) {
                combinations.push(`${cleanPrefix}${cleanKeyword}${tld}`);
            }

            // Keyword + Suffix
            if (cleanKeyword && cleanSuffix) {
                combinations.push(`${cleanKeyword}${cleanSuffix}${tld}`);
            }

            // Prefix + Keyword + Suffix
            if (cleanPrefix && cleanKeyword && cleanSuffix) {
                combinations.push(`${cleanPrefix}${cleanKeyword}${cleanSuffix}${tld}`);
            }
        });

        // Remove duplicates and calculate values
        const uniqueCombinations = [...new Set(combinations)];
        const domainResults: DomainResult[] = uniqueCombinations.map(domain => ({
            domain,
            value: calculateValue(domain),
            status: undefined,
            loading: false
        }));

        // Sort by value (high to low)
        domainResults.sort((a, b) => (b.value || 0) - (a.value || 0));

        setResults(domainResults);
    };

    const handleCheckAvailability = async (index: number) => {
        const domain = results[index].domain;

        // Update loading state
        setResults(prev => prev.map((r, i) =>
            i === index ? { ...r, loading: true } : r
        ));

        try {
            const result = await checkAvailability(domain);

            // Update with result
            setResults(prev => prev.map((r, i) =>
                i === index ? { ...r, status: result.status, loading: false } : r
            ));
        } catch (error) {
            // Update with unknown status on error
            setResults(prev => prev.map((r, i) =>
                i === index ? { ...r, status: 'unknown', loading: false } : r
            ));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Shuffle className="text-primary-700" size={48} />
                    <h1 className="text-4xl font-bold text-gray-900">
                        Creative Domain Mixer
                    </h1>
                </div>
                <p className="text-lg text-gray-600">
                    Combine words to create unique domain names. Mix and match prefixes, keywords, and suffixes.
                </p>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Prefix (Optional)
                        </label>
                        <input
                            type="text"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            placeholder="e.g., Get, My, Go"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-700 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Example: "Get", "My", "Super"
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Keyword (Required) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="e.g., Tech, Cloud, AI"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-700 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Example: "Tech", "Cloud", "Crypto"
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Suffix (Optional)
                        </label>
                        <input
                            type="text"
                            value={suffix}
                            onChange={(e) => setSuffix(e.target.value)}
                            placeholder="e.g., Hub, Pro, Now"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-700 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Example: "Hub", "Pro", "Zone"
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!keyword.trim()}
                    className="w-full px-6 py-4 bg-primary-700 text-white text-lg font-semibold rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Sparkles size={20} />
                    Generate Combinations
                </button>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>How it works:</strong> We'll create all possible combinations of your inputs with popular TLDs
                        (.com, .net, .io, .ai, etc.) and calculate their estimated values.
                    </p>
                </div>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Generated {results.length} Combinations
                        </h2>
                        <p className="text-gray-600">
                            Sorted by estimated value (highest first)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((result, index) => (
                            <DomainCard
                                key={`${result.domain}-${index}`}
                                domain={result.domain}
                                value={result.value}
                                status={result.status}
                                loading={result.loading}
                                onCheck={() => handleCheckAvailability(index)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {results.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <Shuffle size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Start Creating Domain Combinations
                    </h3>
                    <p className="text-gray-500">
                        Enter your words above and click "Generate Combinations"
                    </p>
                </div>
            )}
        </div>
    );
};

export default CreativeMixer;
