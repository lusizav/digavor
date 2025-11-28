import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import DomainCard from '../components/DomainCard';
import { calculateValue, checkAvailability, generateVariations } from '../utils/domainLogic';

interface DomainResult {
    domain: string;
    value: number;
    status?: 'available' | 'taken' | 'unknown';
    loading?: boolean;
}

const Home: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<DomainResult[]>([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = () => {
        if (!keyword.trim()) return;

        setSearching(true);
        const variations = generateVariations(keyword);

        const domainResults: DomainResult[] = variations.map(domain => ({
            domain,
            value: calculateValue(domain),
            status: undefined,
            loading: false
        }));

        // Sort by value (high to low)
        domainResults.sort((a, b) => (b.value || 0) - (a.value || 0));

        setResults(domainResults);
        setSearching(false);
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="text-primary-700" size={48} />
                    <h1 className="text-5xl font-bold text-gray-900">
                        Find Premium Domains Instantly
                    </h1>
                </div>
                <p className="text-xl text-gray-600 mb-8">
                    Discover valuable domain names with AI-powered valuations and instant availability checking
                </p>

                {/* Search Input */}
                <div className="max-w-2xl mx-auto">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter a keyword (e.g., Tech, Cloud, AI)"
                                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-primary-700 focus:outline-none transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={searching || !keyword.trim()}
                            className="px-8 py-4 bg-primary-700 text-white text-lg font-semibold rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {searching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Found {results.length} Premium Domains
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
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Search size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Start Your Domain Search
                    </h3>
                    <p className="text-gray-500">
                        Enter a keyword above to generate premium domain suggestions
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
