// Premium keywords that add value to domains
export const PREMIUM_KEYWORDS = [
    'ai', 'crypto', 'blockchain', 'tech', 'cloud', 'data',
    'smart', 'digital', 'cyber', 'meta', 'web3', 'nft',
    'app', 'hub', 'pro', 'plus', 'market', 'shop',
    'finance', 'pay', 'bank', 'trade', 'invest', 'money'
];

// TLD multipliers for domain valuation
export const TLD_MULTIPLIERS: Record<string, number> = {
    '.com': 15,
    '.net': 8,
    '.io': 12,
    '.ai': 20,
    '.co': 10,
    '.app': 9,
    '.dev': 8,
    '.tech': 7,
    '.xyz': 3,
    '.online': 2
};

// Common suffixes for domain generation
export const DOMAIN_SUFFIXES = [
    'Hub', 'Pro', 'Live', 'Now', 'AI', 'Tech', 'App', 'Net',
    'Go', 'Plus', 'Zone', 'Spot', 'Box', 'Link', 'Base', 'Lab'
];

// Common prefixes for domain generation
export const DOMAIN_PREFIXES = [
    'Get', 'My', 'The', 'Go', 'Try', 'Use', 'Find', 'Best',
    'Top', 'Smart', 'Quick', 'Easy', 'Fast', 'Super'
];

// Modifiers for domain variations
export const DOMAIN_MODIFIERS = [
    { suffix: 'ify', example: 'Techify' },
    { suffix: 'er', example: 'Techer' },
    { suffix: 'ly', example: 'Techly' },
    { suffix: 'able', example: 'Techable' }
];

// TLD options for creative mixer
export const TLDS = ['.com', '.net', '.io', '.ai', '.co', '.app', '.dev', '.tech'];
