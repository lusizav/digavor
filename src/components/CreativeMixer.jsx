import React, { useState } from 'react';
import { Wand2, Plus, Trash2, CheckCircle, Copy, Loader2, Play } from 'lucide-react';
import { checkAvailability, mockCheckAvailability } from '../utils/rdapChecker';

/**
 * Creative Mixer Component
 * Generate hundreds of domain combinations with creative transformations
 */
export default function CreativeMixer() {
    // Input states
    const [prefixes, setPrefixes] = useState(['']);
    const [keywords, setKeywords] = useState(['']);
    const [suffixes, setSuffixes] = useState(['']);

    // Creative mode toggles
    const [vowelDrop, setVowelDrop] = useState(false);
    const [techify, setTechify] = useState(false);
    const [mergeMode, setMergeMode] = useState(false);

    // Results
    const [results, setResults] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [checkingAll, setCheckingAll] = useState(false);
    const [checkProgress, setCheckProgress] = useState(0);

    // Preset lists
    const presetPrefixes = ['Get', 'My', 'The', 'Go', 'Best', 'Top', 'Pro', 'Super', 'Quick', 'Smart'];
    const presetSuffixes = ['Hub', 'Lab', 'Box', 'ly', 'ify', 'Zone', 'Spot', 'Now', 'Pro', 'HQ'];

    /**
     * Add item to list
     */
    const addItem = (list, setList) => {
        setList([...list, '']);
    };

    /**
     * Remove item from list
     */
    const removeItem = (list, setList, index) => {
        if (list.length > 1) {
            setList(list.filter((_, i) => i !== index));
        }
    };

    /**
     * Update item in list
     */
    const updateItem = (list, setList, index, value) => {
        const updated = [...list];
        updated[index] = value;
        setList(updated);
    };

    /**
     * Add preset to list
     */
    const addPreset = (list, setList, preset) => {
        if (!list.includes(preset)) {
            setList([...list.filter(item => item.trim() !== ''), preset]);
        }
    };

    /**
     * Creative transformation: Remove vowels
     */
    const applyVowelDrop = (text) => {
        return text.replace(/[aeiou]/gi, '');
    };

    /**
     * Creative transformation: Merge letter overlap
     */
    const mergeParts = (part1, part2) => {
        if (!part1 || !part2) return part1 + part2;

        const last = part1.slice(-1).toLowerCase();
        const first = part2.slice(0, 1).toLowerCase();

        if (last === first) {
            return part1 + part2.slice(1);
        }
        return part1 + part2;
    };

    /**
     * Generate all domain combinations
     */
    const generateCombinations = () => {
        setGenerating(true);

        const validPrefixes = prefixes.filter(p => p.trim() !== '');
        const validKeywords = keywords.filter(k => k.trim() !== '');
        const validSuffixes = suffixes.filter(s => s.trim() !== '');

        if (validKeywords.length === 0) {
            alert('Please add at least one keyword');
            setGenerating(false);
            return;
        }

        const combinations = [];
        const tlds = techify ? ['.io', '.ai', '.ly'] : ['.com', '.io', '.net', '.co'];

        validKeywords.forEach(keyword => {
            const baseKeyword = keyword.trim().toLowerCase();

            // Prefix + Keyword
            validPrefixes.forEach(prefix => {
                if (prefix.trim()) {
                    let combo = mergeMode
                        ? mergeParts(prefix.trim().toLowerCase(), baseKeyword)
                        : prefix.trim().toLowerCase() + baseKeyword;

                    if (vowelDrop) combo = applyVowelDrop(combo);

                    tlds.forEach(tld => {
                        combinations.push({
                            domain: combo + tld,
                            status: 'unchecked',
                            available: null,
                            checking: false,
                        });
                    });
                }
            });

            // Keyword + Suffix
            validSuffixes.forEach(suffix => {
                if (suffix.trim()) {
                    let combo = mergeMode
                        ? mergeParts(baseKeyword, suffix.trim().toLowerCase())
                        : baseKeyword + suffix.trim().toLowerCase();

                    if (vowelDrop) combo = applyVowelDrop(combo);

                    // If techify is on and suffix is not a TLD-like ending, add techify endings
                    if (techify && !suffix.match(/^(ly|ify)$/)) {
                        combinations.push({
                            domain: combo + 'ly.com',
                            status: 'unchecked',
                            available: null,
                            checking: false,
                        });
                        combinations.push({
                            domain: combo + 'ify.io',
                            status: 'unchecked',
                            available: null,
                            checking: false,
                        });
                    } else {
                        tlds.forEach(tld => {
                            combinations.push({
                                domain: combo + tld,
                                status: 'unchecked',
                                available: null,
                                checking: false,
                            });
                        });
                    }
                }
            });

            // Prefix + Keyword + Suffix
            validPrefixes.forEach(prefix => {
                validSuffixes.forEach(suffix => {
                    if (prefix.trim() && suffix.trim()) {
                        let combo = prefix.trim().toLowerCase();
                        combo = mergeMode ? mergeParts(combo, baseKeyword) : combo + baseKeyword;
                        combo = mergeMode ? mergeParts(combo, suffix.trim().toLowerCase()) : combo + suffix.trim().toLowerCase();

                        if (vowelDrop) combo = applyVowelDrop(combo);

                        tlds.forEach(tld => {
                            combinations.push({
                                domain: combo + tld,
                                status: 'unchecked',
                                available: null,
                                checking: false,
                            });
                        });
                    }
                });
            });

            // Just keyword with TLDs
            tlds.forEach(tld => {
                let combo = baseKeyword;
                if (vowelDrop) combo = applyVowelDrop(combo);

                combinations.push({
                    domain: combo + tld,
                    status: 'unchecked',
                    available: null,
                    checking: false,
                });
            });
        });

        // Remove duplicates
        const unique = Array.from(new Map(combinations.map(item => [item.domain, item])).values());

        setResults(unique);
        setGenerating(false);

        // Auto-check first 20
        setTimeout(() => checkVisibleDomains(unique.slice(0, 20)), 500);
    };

    /**
     * Check visible domains (lazy queue)
     */
    const checkVisibleDomains = async (domainsToCheck) => {
        for (const domain of domainsToCheck) {
            if (domain.status === 'unchecked') {
                await checkSingleDomain(domain.domain);
            }
        }
    };

    /**
     * Check single domain
     */
    const checkSingleDomain = async (domainName) => {
        // Mark as checking
        setResults(prev => prev.map(d =>
            d.domain === domainName ? { ...d, checking: true } : d
        ));

        try {
            let availabilityResult;
            try {
                availabilityResult = await checkAvailability(domainName);
            } catch (error) {
                availabilityResult = await mockCheckAvailability(domainName);
            }

            setResults(prev => prev.map(d =>
                d.domain === domainName
                    ? {
                        ...d,
                        status: availabilityResult.status,
                        available: availabilityResult.available,
                        checking: false,
                    }
                    : d
            ));
        } catch (error) {
            setResults(prev => prev.map(d =>
                d.domain === domainName
                    ? { ...d, status: 'error', checking: false }
                    : d
            ));
        }
    };

    /**
     * Check all domains with rate limiting (3 per second)
     */
    const handleCheckAll = async () => {
        setCheckingAll(true);
        setCheckProgress(0);

        const unchecked = results.filter(d => d.status === 'unchecked');
        const delay = 333; // ~3 per second

        for (let i = 0; i < unchecked.length; i++) {
            await checkSingleDomain(unchecked[i].domain);
            setCheckProgress(i + 1);

            if (i < unchecked.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        setCheckingAll(false);
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
            alert('No available domains to copy yet. Try checking more domains first!');
        }
    };

    const availableCount = results.filter(d => d.status === 'available').length;
    const takenCount = results.filter(d => d.status === 'taken').length;
    const uncheckedCount = results.filter(d => d.status === 'unchecked').length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900">Creative Mixer</h1>
                    <p className="text-slate-600 mt-1">
                        Generate hundreds of unique domains with creative transformations
                    </p>
                </div>
            </div>

            {/* Input Section */}
            <div className="card p-8 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Prefixes Column */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Prefixes (Optional)
                        </label>
                        {prefixes.map((prefix, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={prefix}
                                    onChange={(e) => updateItem(prefixes, setPrefixes, index, e.target.value)}
                                    placeholder="e.g., Get, My, The"
                                    className="input-primary text-sm"
                                />
                                <button
                                    onClick={() => removeItem(prefixes, setPrefixes, index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => addItem(prefixes, setPrefixes)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mt-2"
                        >
                            <Plus className="w-4 h-4" /> Add Prefix
                        </button>

                        <div className="mt-4">
                            <p className="text-xs text-slate-600 mb-2">Quick Add:</p>
                            <div className="flex flex-wrap gap-1">
                                {presetPrefixes.map(preset => (
                                    <button
                                        key={preset}
                                        onClick={() => addPreset(prefixes, setPrefixes, preset)}
                                        className="px-2 py-1 bg-slate-100 hover:bg-primary-100 text-xs rounded"
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Keywords Column */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Keywords (Required) *
                        </label>
                        {keywords.map((keyword, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => updateItem(keywords, setKeywords, index, e.target.value)}
                                    placeholder="e.g., Tech, Food, Shoes"
                                    className="input-primary text-sm"
                                />
                                <button
                                    onClick={() => removeItem(keywords, setKeywords, index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => addItem(keywords, setKeywords)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mt-2"
                        >
                            <Plus className="w-4 h-4" /> Add Keyword
                        </button>
                    </div>

                    {/* Suffixes Column */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Suffixes (Optional)
                        </label>
                        {suffixes.map((suffix, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={suffix}
                                    onChange={(e) => updateItem(suffixes, setSuffixes, index, e.target.value)}
                                    placeholder="e.g., Hub, Lab, Box"
                                    className="input-primary text-sm"
                                />
                                <button
                                    onClick={() => removeItem(suffixes, setSuffixes, index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => addItem(suffixes, setSuffixes)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mt-2"
                        >
                            <Plus className="w-4 h-4" /> Add Suffix
                        </button>

                        <div className="mt-4">
                            <p className="text-xs text-slate-600 mb-2">Quick Add:</p>
                            <div className="flex flex-wrap gap-1">
                                {presetSuffixes.map(preset => (
                                    <button
                                        key={preset}
                                        onClick={() => addPreset(suffixes, setSuffixes, preset)}
                                        className="px-2 py-1 bg-slate-100 hover:bg-primary-100 text-xs rounded"
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Creative Mode Toggles */}
                <div className="border-t-2 border-slate-200 pt-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">🎨 Creative Transformations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <label className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={vowelDrop}
                                onChange={(e) => setVowelDrop(e.target.checked)}
                                className="w-5 h-5 text-purple-600 rounded"
                            />
                            <div>
                                <div className="font-semibold text-purple-900">Vowel Drop</div>
                                <div className="text-xs text-purple-700">Tumblr-style (Tmblr)</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={techify}
                                onChange={(e) => setTechify(e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                            <div>
                                <div className="font-semibold text-blue-900">Techify</div>
                                <div className="text-xs text-blue-700">Force .io, .ai, ly, ify</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={mergeMode}
                                onChange={(e) => setMergeMode(e.target.checked)}
                                className="w-5 h-5 text-pink-600 rounded"
                            />
                            <div>
                                <div className="font-semibold text-pink-900">Merge Letters</div>
                                <div className="text-xs text-pink-700">Travel+Log = Travelog</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="mt-6">
                    <button
                        onClick={generateCombinations}
                        disabled={generating}
                        className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                    >
                        <Wand2 className="w-5 h-5" />
                        {generating ? 'Generating...' : 'Generate Combinations'}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
                <div className="space-y-6">
                    {/* Stats & Actions */}
                    <div className="card p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {results.length} Combinations Generated
                                </h2>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                    <span className="text-green-600 font-semibold">
                                        ✓ {availableCount} Available
                                    </span>
                                    <span className="text-red-600 font-semibold">
                                        ✗ {takenCount} Taken
                                    </span>
                                    <span className="text-slate-500">
                                        ⏸ {uncheckedCount} Unchecked
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleCheckAll}
                                    disabled={checkingAll || uncheckedCount === 0}
                                    className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    {checkingAll ? `Checking... (${checkProgress}/${uncheckedCount})` : 'Check All'}
                                </button>

                                <button
                                    onClick={handleCopyAvailable}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Available ({availableCount})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={`card p-4 hover:shadow-lg transition-all ${result.status === 'available' ? 'ring-2 ring-green-500' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold text-slate-900 truncate flex-1">
                                        {result.domain}
                                    </div>
                                    {result.checking ? (
                                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
                                    ) : result.status === 'available' ? (
                                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                                    ) : result.status === 'taken' ? (
                                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                                    ) : (
                                        <div className="w-3 h-3 bg-slate-300 rounded-full flex-shrink-0"></div>
                                    )}
                                </div>

                                {result.status === 'available' && (
                                    <a
                                        href={`https://www.namecheap.com/domains/registration/results/?domain=${result.domain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full px-3 py-2 bg-gradient-to-r from-success-500 to-success-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all text-center"
                                    >
                                        Buy Now
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
