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
 * Market Regions for domain generation
 */
export type MarketRegion = 'classic' | 'usa' | 'europe' | 'global_tech' | 'arab';

/**
 * Generate domain variations from a keyword
 * Supports multiple market regions with specific prefixes/suffixes
 */
export function generateVariations(keyword: string, region: MarketRegion = 'classic'): string[] {
    if (!keyword || keyword.trim() === '') {
        return [];
    }

    const variations: string[] = [];
    const base = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
    const capitalizedBase = base.charAt(0).toUpperCase() + base.slice(1);

    if (region === 'arab') {
        // Arab/Gulf Market Mode - MENA Region Keywords
        const arabCities = ['Dubai', 'Saudi', 'Qatar', 'Casa', 'Marrakech', 'Egypt', 'Kuwait', 'Riyadh', 'Jeddah', 'Doha'];
        const arabPrefixes = ['Al', 'El', 'i', 'The', 'Best', 'Top', 'My'];
        const arabSuffixes = ['Arabia', 'Gulf', 'Dz', 'Ma', 'Store', 'Shop', 'Online', 'Market'];

        arabCities.forEach(city => variations.push(`${city}${capitalizedBase}.com`));
        arabCities.forEach(city => variations.push(`${capitalizedBase}${city}.com`));
        arabPrefixes.forEach(prefix => variations.push(`${prefix}${capitalizedBase}.com`));
        arabSuffixes.forEach(suffix => variations.push(`${capitalizedBase}${suffix}.com`));

    } else if (region === 'usa') {
        // USA Market Mode - Top Cities & Trends
        const usaCities = ['NYC', 'Miami', 'Austin', 'Cali', 'Texas', 'Vegas', 'LA', 'SF', 'Chicago', 'Boston'];
        const usaPrefixes = ['The', 'My', 'Go', 'Get', 'WeAre', 'Real', 'Pro'];
        const usaSuffixes = ['USA', 'Co', 'Inc', 'LLC', 'HQ', 'Labs', 'Group', 'Team'];

        usaCities.forEach(city => variations.push(`${city}${capitalizedBase}.com`));
        usaCities.forEach(city => variations.push(`${capitalizedBase}${city}.com`));
        usaPrefixes.forEach(prefix => variations.push(`${prefix}${capitalizedBase}.com`));
        usaSuffixes.forEach(suffix => variations.push(`${capitalizedBase}${suffix}.com`));

    } else if (region === 'europe') {
        // Europe Market Mode
        const euCities = ['London', 'Berlin', 'Paris', 'Euro', 'UK', 'Amsterdam', 'Barca', 'Milan', 'Swiss'];
        const euPrefixes = ['Euro', 'The', 'My', 'i', 'e'];
        const euSuffixes = ['EU', 'Europe', 'UK', 'Co', 'Ltd', 'GmbH', 'Group'];

        euCities.forEach(city => variations.push(`${city}${capitalizedBase}.com`));
        euCities.forEach(city => variations.push(`${capitalizedBase}${city}.com`));
        euPrefixes.forEach(prefix => variations.push(`${prefix}${capitalizedBase}.com`));
        euSuffixes.forEach(suffix => variations.push(`${capitalizedBase}${suffix}.com`));

    } else if (region === 'global_tech') {
        // Global Tech Mode
        const techPrefixes = ['Cyber', 'Tech', 'Data', 'Smart', 'Cloud', 'AI', 'Meta', 'Net', 'Sys', 'Web'];
        const techSuffixes = ['Global', 'World', 'Net', 'Planet', 'Sys', 'Tech', 'AI', 'IO', 'Hub', 'Lab'];

        techPrefixes.forEach(prefix => variations.push(`${prefix}${capitalizedBase}.com`));
        techSuffixes.forEach(suffix => variations.push(`${capitalizedBase}${suffix}.com`));
        variations.push(`${base}.net`);
        variations.push(`${base}.io`);
        variations.push(`${base}.ai`);
        variations.push(`${base}.co`);

    } else {
        // Classic Mode (Original English variations)
        variations.push(`${base}.com`);

        const prefixes = ['get', 'my', 'go', 'the', 'try'];
        prefixes.forEach(prefix => variations.push(`${prefix}${base}.com`));

        const suffixes = ['hub', 'pro', 'live', 'now', 'ai', 'tech', 'app', 'net', 'go', 'plus'];
        suffixes.forEach(suffix => variations.push(`${base}${suffix}.com`));

        variations.push(`${base}ify.com`);
        variations.push(`${base}er.com`);
        variations.push(`${base}ly.com`);
    }

    return [...new Set(variations)].slice(0, 30);
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

/**
 * External Intelligence Tools - Free Due Diligence Resources
 */

/**
 * Get Wayback Machine URL for domain history and spam check
 */
export function getWaybackMachineLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    return `https://web.archive.org/web/*/${cleanDomain}`;
}

/**
 * Get Google Trends URL for keyword popularity
 */
export function getGoogleTrendsLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    // Extract domain name without extension
    const domainName = cleanDomain.split('.')[0] || cleanDomain;
    return `https://trends.google.com/trends/explore?q=${encodeURIComponent(domainName)}`;
}

/**
 * Get WIPO Trademark Database URL for legal check
 */
export function getTrademarkCheckLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    // Extract domain name without extension
    const domainName = cleanDomain.split('.')[0] || cleanDomain;
    return `https://branddb.wipo.int/branddb/en/?q=${encodeURIComponent(domainName)}`;
}

/**
 * Get Whois lookup URL for ownership verification
 */
export function getWhoisLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    return `https://who.is/whois/${cleanDomain}`;
}

/**
 * Social Media Profile Links - For manual username availability checking
 */

/**
 * Get Instagram profile URL
 */
export function getInstagramLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    const username = cleanDomain.split('.')[0] || cleanDomain;
    return `https://www.instagram.com/${username}/`;
}

/**
 * Get TikTok profile URL
 */
export function getTikTokLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    const username = cleanDomain.split('.')[0] || cleanDomain;
    return `https://www.tiktok.com/@${username}`;
}

/**
 * Get X (Twitter) profile URL
 */
export function getTwitterLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    const username = cleanDomain.split('.')[0] || cleanDomain;
    return `https://twitter.com/${username}`;
}

/**
 * Get Facebook page URL
 */
export function getFacebookLink(domain: string): string {
    const cleanDomain = domain.toLowerCase().trim();
    const username = cleanDomain.split('.')[0] || cleanDomain;
    return `https://www.facebook.com/${username}`;
}

/**
 * AI Sales Copy Generator - Generate compelling sales description
 */
export function generateSalesCopy(domain: string, value: number): string {
    const cleanDomain = domain.toLowerCase().trim();
    const parts = cleanDomain.split('.');
    const domainName = parts[0] || cleanDomain;
    const extension = parts.length > 1 ? '.' + parts[parts.length - 1] : '.com';
    const length = domainName.length;

    // Determine keyword/niche from domain
    let niche = 'innovative';
    const lowerName = domainName.toLowerCase();

    if (lowerName.includes('tech') || lowerName.includes('ai') || lowerName.includes('app')) {
        niche = 'tech';
    } else if (lowerName.includes('crypto') || lowerName.includes('block') || lowerName.includes('coin')) {
        niche = 'crypto';
    } else if (lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('market')) {
        niche = 'e-commerce';
    } else if (lowerName.includes('health') || lowerName.includes('fit') || lowerName.includes('med')) {
        niche = 'health & wellness';
    } else if (lowerName.includes('game') || lowerName.includes('play')) {
        niche = 'gaming';
    }

    const formattedValue = `$${(value || 0).toLocaleString('en-US')}`;

    // Generate compelling sales copy
    const salesCopy = `🔥 Premium Domain for Sale: ${cleanDomain}!

Ideal for a ${niche} startup or brand looking to make an impact.

✅ Short & Memorable (${length} letters)
✅ ${extension} Extension (Maximum Authority & Trust)
💎 Estimated Value: ${formattedValue}
🚀 Grab it now before it's gone!

Perfect for:
• Building brand recognition
• SEO & organic traffic
• Professional credibility
• Investment opportunity

Don't miss this chance to own a premium digital asset!`;

    return salesCopy;
}

/**
 * Facebook Group Listing Generator - For Arab Domain Flipping Communities
 */
export function generateFacebookPost(domain: string, value: number): string {
    const cleanDomain = domain.toLowerCase().trim();
    const parts = cleanDomain.split('.');
    const domainName = parts[0] || cleanDomain;
    const tld = parts.length > 1 ? '.' + parts[parts.length - 1] : '.com';
    const length = domainName.length;

    // Determine keyword/niche from domain
    let keyword = 'business';
    const lowerName = domainName.toLowerCase();

    if (lowerName.includes('tech') || lowerName.includes('ai') || lowerName.includes('app')) {
        keyword = 'tech/startup';
    } else if (lowerName.includes('crypto') || lowerName.includes('block') || lowerName.includes('coin')) {
        keyword = 'crypto/blockchain';
    } else if (lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('market')) {
        keyword = 'e-commerce/retail';
    } else if (lowerName.includes('dubai') || lowerName.includes('gulf') || lowerName.includes('arab')) {
        keyword = 'MENA/Gulf market';
    } else if (lowerName.includes('health') || lowerName.includes('fit') || lowerName.includes('med')) {
        keyword = 'health/wellness';
    }

    const formattedValue = `$${(value || 0).toLocaleString('en-US')}`;

    // Generate Facebook-optimized post
    const fbPost = `🚨 GEM ALERT 🚨

💎 Domain: ${cleanDomain}
💰 Est. Value: ${formattedValue}
📊 Length: ${length} Letters

🔥 Why it's valuable:
✅ Premium ${tld} extension
✅ Perfect for ${keyword} brand
✅ Short & memorable
✅ HIGH commercial potential

📈 Available NOW!

DM me for details! 

#Domains #DomainFlipping #ArabDomains #Business #Investment #DomainInvesting #DigitalAssets #MENA #GulfBusiness`;

    return fbPost;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Fallback method
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (fallbackError) {
            console.error('Fallback copy failed:', fallbackError);
            return false;
        }
    }
}
