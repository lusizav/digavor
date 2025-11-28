import React, { useState } from 'react';
import { Search, Sparkles, Globe, ShieldCheck, Loader2 } from 'lucide-react';
import DomainCard from '../components/DomainCard';
import { calculateValue, checkAvailability, generateVariations, MarketRegion } from '../utils/domainLogic';
import { TRENDING_KEYWORDS } from '../utils/outboundLogic';

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
    const [region, setRegion] = useState<MarketRegion>('classic');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });

    const handleSearch = async () => {
        if (!keyword.trim()) return;

        setSearching(true);
        setResults([]); // Clear previous results

        const variations = generateVariations(keyword, region);

        if (showAvailableOnly) {
            // Scanner Mode: Check availability in real-time
            setScanProgress({ current: 0, total: variations.length });

            const availableDomains: DomainResult[] = [];

            for (let i = 0; i < variations.length; i++) {
                const domain = variations[i];
                setScanProgress({ current: i + 1, total: variations.length });

                // 1 second delay to respect rate limits
                if (i > 0) await new Promise(resolve => setTimeout(resolve, 1000));

                try {
                    const availability = await checkAvailability(domain);

                    if (availability.status === 'available') {
                        const result: DomainResult = {
                            domain,
                            value: calculateValue(domain),
                            status: 'available',
                            loading: false
                        };

                        // Add to results immediately
                        setResults(prev => {
                            const newResults = [...prev, result];
                            return newResults.sort((a, b) => (b.value || 0) - (a.value || 0));
                        });
                    }
                } catch (error) {
                    console.error(`Error checking ${domain}:`, error);
                }
            }
        } else {
            // Classic Mode: Generate all, check later
            const domainResults: DomainResult[] = variations.map(domain => ({
                domain,
                value: calculateValue(domain),
                status: undefined,
                loading: false
            }));

            // Sort by value (high to low)
            domainResults.sort((a, b) => (b.value || 0) - (a.value || 0));
            setResults(domainResults);
        }

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
                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3 mb-4">
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
                            className="px-8 py-4 bg-primary-700 text-white text-lg font-semibold rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {searching ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    {showAvailableOnly ? `Scanning ${scanProgress.current}/${scanProgress.total}` : 'Searching...'}
                                </>
                            ) : (
                                'Generate'
                            )}
                        </button>
                    </div>

                    {/* Controls Row: Region Selector & Scanner Toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        {/* Region Selector */}
                        <div className="flex items-center gap-3">
                            <Globe className="text-gray-500" size={20} />
                            <span className="text-sm font-medium text-gray-700">Market Region:</span>
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value as MarketRegion)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                            >
                                <option value="classic">Classic (Global)</option>
                                <option value="usa">🇺🇸 USA (Top Cities)</option>
                                <option value="europe">🇪🇺 Europe</option>
                                <option value="global_tech">🌏 Global Tech</option>
                                <option value="arab">🇲🇦 Arab/Gulf</option>
                            </select>
                        </div>

                        {/* Live Availability Filter Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={showAvailableOnly}
                                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </div>
                            <span className="flex items-center gap-2 text-gray-700 font-medium group-hover:text-green-700 transition-colors">
                                <ShieldCheck size={18} className={showAvailableOnly ? "text-green-600" : "text-gray-400"} />
                                Show Only Available
                            </span>
                        </label>
                    </div>

                    {/* Brady's Trending Keywords */}
                    <div className="mt-4 border-t pt-4">
                        <p className="text-sm text-gray-600 mb-2 font-medium">🔥 Brady's Hot Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                            {TRENDING_KEYWORDS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setKeyword(tag);
                                        // Small delay to allow state update
                                        setTimeout(() => {
                                            // We can't easily call handleSearch here because of closure staleness
                                            // But setting keyword is enough for user to just click Generate
                                            // Or we could use a useEffect to trigger search when keyword changes if a flag is set
                                            // For now, just setting keyword is good UX
                                        }, 100);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-full hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-md"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
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
