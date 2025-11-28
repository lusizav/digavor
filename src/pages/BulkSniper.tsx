import React, { useState } from 'react';
import { ListChecks, Loader2, AlertCircle } from 'lucide-react';
import ResultsTable from '../components/ResultsTable';
import { calculateValue, checkAvailability, parseDomainList } from '../utils/domainLogic';

interface DomainData {
    domain: string;
    value: number;
    status?: 'available' | 'taken' | 'unknown';
}

const BulkSniper: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [domains, setDomains] = useState<DomainData[]>([]);
    const [checking, setChecking] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const handleAnalyze = () => {
        if (!inputText.trim()) return;

        const parsedDomains = parseDomainList(inputText);

        if (parsedDomains.length === 0) {
            alert('No valid domains found. Please enter one domain per line.');
            return;
        }

        // Calculate values for all domains
        const domainsWithValues: DomainData[] = parsedDomains.map(domain => ({
            domain,
            value: calculateValue(domain),
            status: undefined
        }));

        // Sort by value (high to low)
        domainsWithValues.sort((a, b) => (b.value || 0) - (a.value || 0));

        setDomains(domainsWithValues);
    };

    const handleCheckAvailability = async () => {
        if (domains.length === 0 || checking) return;

        setChecking(true);

        // Only check top 10 domains to respect rate limits
        const domainsToCheck = domains.slice(0, 10);
        setProgress({ current: 0, total: domainsToCheck.length });

        // Process domains one by one with 1-second delay
        for (let i = 0; i < domainsToCheck.length; i++) {
            const domain = domainsToCheck[i].domain;
            setProgress({ current: i + 1, total: domainsToCheck.length });

            try {
                const result = await checkAvailability(domain);

                // Update the domain in the list
                setDomains(prev => prev.map(d =>
                    d.domain === domain ? { ...d, status: result.status } : d
                ));

                // Wait 1 second before next check (unless it's the last one)
                if (i < domainsToCheck.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                // Mark as unknown on error
                setDomains(prev => prev.map(d =>
                    d.domain === domain ? { ...d, status: 'unknown' } : d
                ));
            }
        }

        setChecking(false);
        setProgress({ current: 0, total: 0 });
    };

    const handleSingleCheck = async (domain: string, index: number) => {
        try {
            const result = await checkAvailability(domain);
            setDomains(prev => prev.map((d, i) =>
                i === index ? { ...d, status: result.status } : d
            ));
        } catch (error) {
            setDomains(prev => prev.map((d, i) =>
                i === index ? { ...d, status: 'unknown' } : d
            ));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <ListChecks className="text-primary-700" size={48} />
                    <h1 className="text-4xl font-bold text-gray-900">
                        Bulk Domain Sniper
                    </h1>
                </div>
                <p className="text-lg text-gray-600">
                    Paste your domain list from ExpiredDomains or any source. We'll calculate values and check availability.
                </p>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Paste Domain List (one per line)
                </label>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Example:&#10;techHub.com&#10;aiCloud.io&#10;cryptoMarket.net"
                    rows={10}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-700 focus:outline-none font-mono text-sm"
                />

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleAnalyze}
                        disabled={!inputText.trim()}
                        className="px-6 py-3 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Analyze Domains
                    </button>

                    {domains.length > 0 && (
                        <button
                            onClick={handleCheckAvailability}
                            disabled={checking}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {checking ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Checking {progress.current} of {progress.total}...
                                </>
                            ) : (
                                <>Check Top 10 Availability</>
                            )}
                        </button>
                    )}
                </div>

                {domains.length > 10 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-blue-800">
                            <strong>Rate Limiting:</strong> To respect API limits, we only check the top 10 domains automatically.
                            You can manually check others individually from the table.
                        </p>
                    </div>
                )}
            </div>

            {/* Results Section */}
            {domains.length > 0 && (
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Analyzed {domains.length} Domains
                        </h2>
                        <p className="text-gray-600">
                            Sorted by estimated value (highest first)
                        </p>
                    </div>

                    <ResultsTable
                        domains={domains}
                        onCheckAvailability={handleSingleCheck}
                        loading={checking}
                    />
                </div>
            )}
        </div>
    );
};

export default BulkSniper;
