import React from 'react';
import { Search, Shield, Zap, CheckCircle } from 'lucide-react';

/**
 * Professional Hero Section
 * Enterprise-ready design with trust signals
 */
export default function Hero({ onSearch, searchTerm, setSearchTerm, loading }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <div className="hero-section">
            <div className="hero-container">
                {/* Main Headline */}
                <h1 className="hero-title">
                    Find Premium Domains Instantly
                </h1>

                {/* Subheadline - Professional copy */}
                <p className="hero-subtitle">
                    Advanced algorithm-driven valuation and availability checks.
                    Secure your digital identity today.
                </p>

                {/* Large Search Box */}
                <form onSubmit={handleSubmit} className="search-container">
                    <div className="search-box">
                        <div className="flex-1 flex items-center gap-3">
                            <Search className="w-6 h-6 text-slate-400 ml-2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Enter your ideal domain name or keyword..."
                                className="flex-1 px-2 py-4 text-lg bg-transparent border-none focus:outline-none placeholder:text-slate-400 text-slate-900"
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !searchTerm.trim()}
                            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? 'Searching...' : 'Search Domains'}
                        </button>
                    </div>
                </form>

                {/* Trust Signals Row */}
                <div className="trust-row">
                    <div className="trust-badge">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">Secure RDAP Protocol</span>
                    </div>
                    <div className="trust-badge">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Real-Time Availability</span>
                    </div>
                    <div className="trust-badge">
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                        <span className="font-medium">Instant Valuation</span>
                    </div>
                </div>

                {/* Feature Highlights - Clean White Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
                    <div className="feature-card">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Search className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Smart Search
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Intelligent domain generation with 50+ variations. Our algorithm finds the perfect match for your brand.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Live Verification
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Real-time RDAP protocol checks with strict validation. No false positives, accurate results.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Instant Pricing
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Advanced valuation algorithm considers TLD, length, keywords, and market trends instantly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
