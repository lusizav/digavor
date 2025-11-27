import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import Hero from './components/Hero';
import ResultsTable from './components/ResultsTable';
import ExpiredDomainSearch from './components/ExpiredDomainSearch';
import BulkSniper from './components/BulkSniper';
import CreativeMixer from './components/CreativeMixer';
import { generateDomains } from './utils/domainGenerator';
import { checkAvailability } from './utils/rdapChecker';
import { calculateDomainValue } from './utils/valuationAlgorithm';

/**
 * Professional DomainHunter App
 * Enterprise-ready SaaS design
 */
function App() {
    const [keyword, setKeyword] = useState('');
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('generator');

    // Navigation tabs configuration
    const tabs = [
        { id: 'generator', label: 'Domain Search', icon: Globe },
        { id: 'expired', label: 'Expired Domains', icon: Globe },
        { id: 'bulk', label: 'Bulk Checker', icon: Globe },
        { id: 'mixer', label: 'Creative Mixer', icon: Globe }
    ];

    // Domain search handler
    const handleSearch = async (searchKeyword) => {
        setLoading(true);
        const generated = generateDomains(searchKeyword);

        const domainsWithStatus = generated.map(domain => ({
            name: domain,
            status: 'checking',
            available: null,
            value: null
        }));

        setDomains(domainsWithStatus);

        // Check availability for each domain
        for (let i = 0; i < generated.length; i++) {
            const domain = generated[i];

            try {
                const result = await checkAvailability(domain);
                const value = calculateDomainValue(domain);

                setDomains(prev => prev.map(d =>
                    d.name === domain
                        ? {
                            ...d,
                            status: result.status,
                            available: result.available,
                            value: value,
                            message: result.message
                        }
                        : d
                ));

                // Small delay between checks
                if (i < generated.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            } catch (error) {
                setDomains(prev => prev.map(d =>
                    d.name === domain
                        ? { ...d, status: 'error', available: null, value: null }
                        : d
                ));
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Professional Top Navigation */}
            <nav className="nav-container">
                <div className="nav-inner">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <span className="nav-logo">DomainHunter</span>
                    </div>

                    {/* Center Navigation Links */}
                    <div className="nav-links">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`nav-link ${activeTab === tab.id ? 'nav-link-active' : ''}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Right CTA */}
                    <div className="flex items-center gap-4">
                        <button className="nav-cta">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {/* Domain Generator Tab */}
                {activeTab === 'generator' && (
                    <>
                        <Hero
                            onSearch={handleSearch}
                            searchTerm={keyword}
                            setSearchTerm={setKeyword}
                            loading={loading}
                        />

                        {/* Results Section */}
                        {(loading || domains.length > 0) && (
                            <div className="section-gray">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <ResultsTable
                                        domains={domains}
                                        loading={loading}
                                        keyword={keyword}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Expired Domains Tab */}
                {activeTab === 'expired' && (
                    <div className="bg-slate-50 min-h-screen">
                        <ExpiredDomainSearch />
                    </div>
                )}

                {/* Bulk Sniper Tab */}
                {activeTab === 'bulk' && (
                    <div className="section bg-slate-50 min-h-screen">
                        <BulkSniper />
                    </div>
                )}

                {/* Creative Mixer Tab */}
                {activeTab === 'mixer' && (
                    <div className="section bg-slate-50 min-h-screen">
                        <CreativeMixer />
                    </div>
                )}
            </main>

            {/* Professional Footer */}
            <footer className="bg-white border-t border-slate-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">DomainHunter</span>
                            </div>
                            <p className="text-sm text-slate-600">
                                Professional domain search and valuation platform.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">API</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Support</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-600">
                        © 2025 DomainHunter. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
