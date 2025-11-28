import { PREMIUM_KEYWORDS, TLD_MULTIPLIERS } from './constants';

export interface AvailabilityResult {
    status: 'available' | 'taken' | 'unknown';
    message?: string;
}

/**
 * Calculate the estimated value of a domain
 * CRITICAL: Always returns a number, never null/undefined
 */
export function calculateValue(domain: string): number {
    if (!domain || domain.trim() === '') {
        return 10; // Base value for empty/invalid domains
    }

    const domainLower = domain.toLowerCase();
    let value = 10; // Base value

    // Extract domain name and TLD
    const parts = domainLower.split('.');
    const name = parts[0] || '';
    const tld = parts.length > 1 ? '.' + parts[parts.length - 1] : '.com';

    // TLD multiplier
    const tldMultiplier = TLD_MULTIPLIERS[tld] || 1;
    value *= tldMultiplier;

    // Length bonus (shorter is better)
    if (name.length <= 5) {
        value += 1000;
    } else if (name.length <= 7) {
        value += 500;
    } else if (name.length <= 10) {
        value += 200;
    }

    // Check for premium keywords
    PREMIUM_KEYWORDS.forEach(keyword => {
        if (name.includes(keyword)) {
            value += 500;
        }
    });

    // Single word bonus
    if (name.length > 0 && !name.match(/[-_0-9]/)) {
        value += 100;
    }

    // Ensure we always return a valid number
    return Math.round(value) || 10;
}

/**
 * Check domain availability using RDAP protocol
 * RDAP logic: 404 = Available, 200 = Taken
 */
export async function checkAvailability(domain: string): Promise<AvailabilityResult> {
    if (!domain || domain.trim() === '') {
        return {
            status: 'unknown',
            message: 'Invalid domain'
        };
    }

    try {
        const cleanDomain = domain.toLowerCase().trim();
        const response = await fetch(`https://rdap.org/domain/${cleanDomain}`, {
            method: 'GET',
            mode: 'cors',
        });

        if (response.status === 404) {
            return {
                status: 'available',
                message: 'Domain is available'
            };
        } else if (response.status === 200) {
            return {
                status: 'taken',
                message: 'Domain is registered'
            };
        } else {
            return {
                status: 'unknown',
                message: 'Unable to determine status'
            };
        }
    } catch (error) {
        // Handle CORS errors or network issues gracefully
        console.warn('RDAP check failed:', error);
        return {
            status: 'unknown',
            message: 'Unable to check availability (CORS/Network error)'
        };
    }
}

/**
 * Generate Namecheap affiliate link
 * Note: Replace YOUR_ID with actual affiliate ID
 */
export function getAffiliateLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    const affiliateId = 'YOUR_ID'; // TODO: Replace with actual affiliate ID
    return `https://www.namecheap.com/domains/registration/results/?domain=${cleanDomain}&aff=${affiliateId}`;
}

/**
 * Generate domain variations from a keyword
 */
export function generateVariations(keyword: string): string[] {
    if (!keyword || keyword.trim() === '') {
        return [];
    }

    const variations: string[] = [];
    const base = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Original with .com
    variations.push(`${base}.com`);

    // With prefixes
    const prefixes = ['get', 'my', 'go', 'the', 'try'];
    prefixes.forEach(prefix => {
        variations.push(`${prefix}${base}.com`);
    });

    // With suffixes
    const suffixes = ['hub', 'pro', 'live', 'now', 'ai', 'tech', 'app', 'net', 'go', 'plus'];
    suffixes.forEach(suffix => {
        variations.push(`${base}${suffix}.com`);
    });

    // With modifiers
    variations.push(`${base}ify.com`);
    variations.push(`${base}er.com`);
    variations.push(`${base}ly.com`);

    // Return first 20 unique variations
    return [...new Set(variations)].slice(0, 20);
}

/**
 * Parse domain list from text (for bulk sniper)
 */
export function parseDomainList(text: string): string[] {
    if (!text || text.trim() === '') {
        return [];
    }

    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Extract domain if it's in a table format or has extra columns
            const match = line.match(/([a-z0-9-]+\.[a-z]{2,})/i);
            return match ? match[1] : line;
        })
        .filter(domain => domain.includes('.'));
}
