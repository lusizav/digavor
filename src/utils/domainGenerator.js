/**
 * Smart Domain Generator
 * Generates 50+ domain variations from a keyword using prefixes, suffixes, and multiple TLDs
 */

const PREFIXES = [
    'Get', 'Go', 'The', 'My', 'Try', 'Use', 'Best', 'Top', 'Pro', 'Super',
    'Smart', 'Quick', 'Easy', 'Fast', 'Next', 'New', 'One', 'All', 'Real', 'True'
];

const SUFFIXES = [
    'ly', 'ify', 'HQ', 'Hub', 'Zone', 'Lab', 'App', 'Tech', 'AI', 'Now',
    'Pro', 'Plus', 'Max', 'Go', 'Spot', 'Box', 'Kit', 'Live', 'Direct', 'Central'
];

const TLDS = [
    '.com', '.io', '.net', '.co', '.app', '.dev', '.tech', '.ai',
    '.online', '.site', '.store', '.digital', '.cloud', '.shop'
];

/**
 * Generate domain variations from a keyword
 * @param {string} keyword - The base keyword to generate domains from
 * @returns {Array<Object>} Array of domain objects with name and initial state
 */
export function generateDomains(keyword) {
    if (!keyword || keyword.trim() === '') {
        return [];
    }

    const cleanKeyword = keyword.trim().toLowerCase().replace(/\s+/g, '');
    const domains = new Set();

    // 1. Base keyword with different TLDs
    TLDS.forEach(tld => {
        domains.add(`${cleanKeyword}${tld}`);
    });

    // 2. Keyword with prefixes
    PREFIXES.slice(0, 8).forEach(prefix => {
        TLDS.slice(0, 6).forEach(tld => {
            domains.add(`${prefix.toLowerCase()}${cleanKeyword}${tld}`);
        });
    });

    // 3. Keyword with suffixes
    SUFFIXES.slice(0, 10).forEach(suffix => {
        TLDS.slice(0, 6).forEach(tld => {
            domains.add(`${cleanKeyword}${suffix.toLowerCase()}${tld}`);
        });
    });

    // 4. Keyword combinations (prefix + keyword + suffix)
    PREFIXES.slice(0, 3).forEach(prefix => {
        SUFFIXES.slice(0, 3).forEach(suffix => {
            domains.add(`${prefix.toLowerCase()}${cleanKeyword}${suffix.toLowerCase()}.com`);
            domains.add(`${prefix.toLowerCase()}${cleanKeyword}${suffix.toLowerCase()}.io`);
        });
    });

    // Convert Set to Array and create domain objects
    return Array.from(domains).map(domain => ({
        name: domain,
        status: 'checking', // checking, available, taken, error
        available: null,
        value: 0,
        loading: true
    }));
}

/**
 * Extract the base domain name without TLD
 * @param {string} domain - Full domain name
 * @returns {string} Base name without TLD
 */
export function getBaseName(domain) {
    return domain.split('.')[0];
}

/**
 * Extract TLD from domain
 * @param {string} domain - Full domain name
 * @returns {string} TLD including the dot (e.g., '.com')
 */
export function getTLD(domain) {
    const parts = domain.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
}
