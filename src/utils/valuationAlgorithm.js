/**
 * Domain Valuation Algorithm
 * Estimates domain value based on multiple factors (no paid APIs required)
 */

/**
 * Calculate estimated domain value
 * @param {string} domain - Full domain name (e.g., 'example.com')
 * @returns {Object} Valuation result with value and formatted price
 * 
 * Valuation Criteria:
 * 1. Base Value: $10
 * 2. Extension Multiplier:
 *    - .com: ×15
 *    - .io: ×10
 *    - .net: ×5
 *    - .ai: ×12
 *    - .app, .dev, .tech: ×8
 *    - Others: ×1
 * 3. Length Bonus:
 *    - < 5 characters: +$5,000
 *    - < 8 characters: +$500
 * 4. Keyword Bonus: +$1,000 each for:
 *    - ai, tech, bet, crypto, shop, app, cloud, digital, smart, data
 */
export function calculateDomainValue(domain) {
    let value = 10; // Base value

    // Extract domain parts
    const parts = domain.toLowerCase().split('.');
    const baseName = parts[0];
    const tld = parts.length > 1 ? `.${parts[parts.length - 1]}` : '';

    // 1. Extension Multiplier
    const extensionMultipliers = {
        '.com': 15,
        '.io': 10,
        '.ai': 12,
        '.net': 5,
        '.app': 8,
        '.dev': 8,
        '.tech': 8,
        '.co': 6,
        '.org': 4,
        '.store': 3,
        '.shop': 3,
        '.online': 2,
        '.site': 2,
        '.digital': 3,
        '.cloud': 4,
    };

    const multiplier = extensionMultipliers[tld] || 1;
    value *= multiplier;

    // 2. Length Bonus
    if (baseName.length < 5) {
        value += 5000;
    } else if (baseName.length < 8) {
        value += 500;
    }

    // 3. Keyword Bonus
    const premiumKeywords = [
        'ai', 'tech', 'bet', 'crypto', 'shop', 'app',
        'cloud', 'digital', 'smart', 'data', 'web', 'net',
        'mobile', 'global', 'world', 'pay', 'buy', 'get',
        'pro', 'super', 'mega', 'ultra', 'prime', 'elite'
    ];

    let keywordBonus = 0;
    premiumKeywords.forEach(keyword => {
        if (baseName.includes(keyword)) {
            keywordBonus += 1000;
        }
    });

    value += keywordBonus;

    // 4. Additional factors

    // Penalize domains with numbers or hyphens
    if (/\d/.test(baseName) || baseName.includes('-')) {
        value *= 0.7;
    }

    // Bonus for dictionary words (simplified check - if it's pronounceable)
    const vowelCount = (baseName.match(/[aeiou]/g) || []).length;
    if (vowelCount >= 2 && baseName.length >= 5) {
        value *= 1.2;
    }

    // Bonus for brandable domains (alternating consonant-vowel pattern)
    if (isBrandable(baseName)) {
        value += 300;
    }

    // Round to nearest dollar
    value = Math.round(value);

    // Ensure minimum value
    value = Math.max(value, 10);

    return {
        value,
        formatted: formatCurrency(value),
        breakdown: {
            base: 10,
            multiplier,
            lengthBonus: baseName.length < 5 ? 5000 : (baseName.length < 8 ? 500 : 0),
            keywordBonus,
            tld,
            length: baseName.length,
        }
    };
}

/**
 * Check if domain is brandable (easy to pronounce and remember)
 * @param {string} name - Domain base name
 * @returns {boolean}
 */
function isBrandable(name) {
    // Simple heuristic: reasonable vowel distribution
    const vowels = (name.match(/[aeiou]/g) || []).length;
    const consonants = name.length - vowels;

    // Good balance of vowels and consonants
    if (vowels === 0 || consonants === 0) return false;

    const ratio = vowels / name.length;
    return ratio >= 0.25 && ratio <= 0.5;
}

/**
 * Format number as currency
 * @param {number} value - Numeric value
 * @returns {string} Formatted currency string (e.g., "$1,500")
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Get value tier label
 * @param {number} value - Domain value
 * @returns {string} Tier label
 */
export function getValueTier(value) {
    if (value >= 10000) return 'Premium';
    if (value >= 5000) return 'High Value';
    if (value >= 1000) return 'Good Value';
    if (value >= 100) return 'Standard';
    return 'Budget';
}

/**
 * Batch calculate values for multiple domains
 * @param {Array<string>} domains - Array of domain names
 * @returns {Array<Object>} Array of valuation results
 */
export function calculateMultipleValues(domains) {
    return domains.map(domain => ({
        domain,
        ...calculateDomainValue(domain)
    }));
}
