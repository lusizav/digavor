import React, { useState, useEffect } from 'react';
import { Search, Archive, TrendingUp, Sparkles, Filter, Download, Heart, Grid3x3, List, SortAsc, SortDesc } from 'lucide-react';
import ExpiredDomainCard from './ExpiredDomainCard';
import LoadingSpinner from './LoadingSpinner';
import { generateExpiredDomains, exportToCSV } from '../utils/expiredDomainGenerator';

/**
 * Enhanced Expired Domain Search Component
 * With filtering, sorting, favorites, export, and view modes
 */
export default function ExpiredDomainSearch() {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // View mode
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    // Filters
    const [filters, setFilters] = useState({
        minDA: 0,
        maxPrice: 10000,
        minBacklinks: 0,
        minAge: 0,
        showTrendingOnly: false,
        showFavoritesOnly: false,
    });

    // Sorting
    const [sortBy, setSortBy] = useState('price'); // price, da, backlinks, age, traffic
    const [sortOrder, setSortOrder] = useState('desc'); // asc or desc

    // Favorites (stored in localStorage)
    useEffect(() => {
        const saved = localStorage.getItem('expiredDomainFavorites');
        if (saved) {
            const favorites = JSON.parse(saved);
            setResults(prev => prev.map(d => ({
                ...d,
                favorite: favorites.includes(d.name)
            })));
        }
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setLoading(true);
        setSearched(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        const expiredDomains = generateExpiredDomains(keyword);
        setResults(expiredDomains);
        setLoading(false);
    };

    const handleQuickSearch = (tag) => {
        setKeyword(tag);
    };

    // Toggle favorite
    const toggleFavorite = (domainName) => {
        setResults(prev => {
            const updated = prev.map(d =>
                d.name === domainName ? { ...d, favorite: !d.favorite } : d
            );

            // Save to localStorage
            const favorites = updated.filter(d => d.favorite).map(d => d.name);
            localStorage.setItem('expiredDomainFavorites', JSON.stringify(favorites));

            return updated;
        });
    };

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...results];

        // Apply filters
        filtered = filtered.filter(d => {
            if (d.domainAuthority < filters.minDA) return false;
            if (d.price > filters.maxPrice) return false;
            if (d.backlinks < filters.minBacklinks) return false;
            if (d.age < filters.minAge) return false;
            if (filters.showTrendingOnly && !d.isTrending) return false;
            if (filters.showFavoritesOnly && !d.favorite) return false;
            return true;
        });

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'da':
                    comparison = a.domainAuthority - b.domainAuthority;
                    break;
                case 'backlinks':
                    comparison = a.backlinks - b.backlinks;
                    break;
                case 'age':
                    comparison = a.age - b.age;
                    break;
                case 'traffic':
                    comparison = a.monthlyTraffic - b.monthlyTraffic;
                    break;
                default:
                    comparison = 0;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        setFilteredResults(filtered);
    }, [results, filters, sortBy, sortOrder]);

    const handleExport = () => {
        if (filteredResults.length > 0) {
            exportToCSV(filteredResults);
        }
    };

    const trendingCount = results.filter(d => d.isTrending).length;
    const favoritesCount = results.filter(d => d.favorite).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Archive className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900">
                        Expired Domain Finder Pro
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Advanced filtering, sorting, and analytics for domain investors
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className="card p-8 mb-8">
                {/* CRITICAL DISCLAIMER */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 mb-6 border-2 border-red-200">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900 mb-2 text-lg">
                                Demo Data Only - Always Verify Availability!
                            </h3>
                            <p className="text-red-800 text-sm leading-relaxed mb-2">
                                <strong>IMPORTANT:</strong> This section displays <strong>simulated expired domain data</strong> for demonstration purposes only.
                                Domain availability shown here is randomly generated and <strong>NOT accurate</strong>.
                            </p>
                            <p className="text-red-800 text-sm leading-relaxed font-semibold">
                                ✓ Always check actual availability on Namecheap, GoDaddy, or other registrars before purchasing<br />
                                ✓ For real expired domain data, integrate with APIs like ExpiredDomains.net, DropCatch, or GoDaddy Auctions
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6 border border-purple-100">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-purple-900 mb-2">
                                Feature Demo
                            </h3>
                            <p className="text-purple-800 text-sm leading-relaxed">
                                This demonstrates: Advanced filters, comprehensive metrics, favorites system, CSV export, and sorting capabilities.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Search Expired Domains by Keyword
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="e.g., crypto, design, marketing..."
                                className="input-primary pl-12"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Searching...' : 'Find Domains'}
                        </button>
                    </div>
                </form>

                <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Popular Keywords:</p>
                    <div className="flex flex-wrap gap-2">
                        {['tech', 'ai', 'crypto', 'health', 'finance', 'design', 'marketing', 'shop'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleQuickSearch(tag)}
                                className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-purple-500 hover:text-purple-600 transition-all duration-200 hover:shadow-md"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {loading && (
                <div className="card p-12">
                    <LoadingSpinner size="lg" text="Searching expired domains..." />
                </div>
            )}

            {!loading && searched && results.length > 0 && (
                <div className="space-y-6">
                    {/* Controls Bar */}
                    <div className="card p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {filteredResults.length} Domains Found
                                </h2>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm">
                                    {trendingCount > 0 && (
                                        <span className="text-orange-600 font-semibold flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            {trendingCount} Trending
                                        </span>
                                    )}
                                    {favoritesCount > 0 && (
                                        <span className="text-pink-600 font-semibold flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {favoritesCount} Favorites
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {/* View Mode Toggle */}
                                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                                    >
                                        <Grid3x3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Export Button */}
                                <button
                                    onClick={handleExport}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">
                                    Min DA
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={filters.minDA}
                                    onChange={(e) => setFilters({ ...filters, minDA: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="text-xs text-slate-500 mt-1">{filters.minDA}+</div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">
                                    Max Price
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    step="100"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="text-xs text-slate-500 mt-1">${filters.maxPrice}</div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">
                                    Min Backlinks
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="50"
                                    value={filters.minBacklinks}
                                    onChange={(e) => setFilters({ ...filters, minBacklinks: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="text-xs text-slate-500 mt-1">{filters.minBacklinks}+</div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">
                                    Min Age (years)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    value={filters.minAge}
                                    onChange={(e) => setFilters({ ...filters, minAge: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="text-xs text-slate-500 mt-1">{filters.minAge}+ years</div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.showTrendingOnly}
                                        onChange={(e) => setFilters({ ...filters, showTrendingOnly: e.target.checked })}
                                        className="w-4 h-4 text-orange-600 rounded"
                                    />
                                    <span className="text-xs font-semibold text-slate-700">Trending Only</span>
                                </label>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.showFavoritesOnly}
                                        onChange={(e) => setFilters({ ...filters, showFavoritesOnly: e.target.checked })}
                                        className="w-4 h-4 text-pink-600 rounded"
                                    />
                                    <span className="text-xs font-semibold text-slate-700">Favorites Only</span>
                                </label>
                            </div>
                        </div>

                        {/* Sorting */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-semibold text-slate-700">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                            >
                                <option value="price">Price</option>
                                <option value="da">Domain Authority</option>
                                <option value="backlinks">Backlinks</option>
                                <option value="age">Age</option>
                                <option value="traffic">Traffic</option>
                            </select>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="p-2 border-2 border-slate-200 rounded-lg hover:border-primary-500 transition-colors"
                            >
                                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Results Grid/List */}
                    {filteredResults.length > 0 ? (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                            : "space-y-4"
                        }>
                            {filteredResults.map((domain, index) => (
                                <ExpiredDomainCard
                                    key={index}
                                    domain={domain}
                                    viewMode={viewMode}
                                    onToggleFavorite={toggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">
                                No domains match your filters
                            </h3>
                            <p className="text-slate-500">
                                Try adjusting your filter settings
                            </p>
                        </div>
                    )}
                </div>
            )}

            {!loading && searched && results.length === 0 && (
                <div className="card text-center p-12">
                    <Archive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">
                        No Results Found
                    </h3>
                    <p className="text-slate-500">
                        Try a different keyword
                    </p>
                </div>
            )}
        </div>
    );
}
