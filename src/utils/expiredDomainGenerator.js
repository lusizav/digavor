/**
 * Enhanced Expired Domain Generator & Simulator
 * Generates mock expired domain suggestions with comprehensive metrics
 */

const PREFIXES = ['my', 'get', 'the', 'best', 'top', 'pro', 'cheap', 'buy', 'find', 'online'];
const SUFFIXES = ['hub', 'zone', 'center', 'shop', 'store', 'deals', 'plus', 'now', 'pro', 'online'];
const EXPIRED_TLDS = ['.com', '.net', '.org', '.co', '.info', '.biz'];

/**
 * Generate mock expired domain suggestions with enhanced metrics
 */
export function generateExpiredDomains(keyword) {
    if (!keyword || keyword.trim() === '') {
        return [];
    }

    const cleanKeyword = keyword.trim().toLowerCase().replace(/\s+/g, '');
    const results = [];

    // Generate various combinations
    EXPIRED_TLDS.forEach(tld => {
        results.push(createExpiredDomain(`${cleanKeyword}${tld}`, cleanKeyword));
    });

    PREFIXES.slice(0, 5).forEach(prefix => {
        EXPIRED_TLDS.slice(0, 3).forEach(tld => {
            results.push(createExpiredDomain(`${prefix}${cleanKeyword}${tld}`, cleanKeyword));
        });
    });

    SUFFIXES.slice(0, 5).forEach(suffix => {
        EXPIRED_TLDS.slice(0, 3).forEach(tld => {
            results.push(createExpiredDomain(`${cleanKeyword}${suffix}${tld}`, cleanKeyword));
        });
    });

    ['24', '365', 'world', 'direct'].forEach(variant => {
        results.push(createExpiredDomain(`${cleanKeyword}${variant}.com`, cleanKeyword));
    });

    return shuffleArray(results).slice(0, 30);
}

/**
 * Create an expired domain object with comprehensive metrics
 */
function createExpiredDomain(domain, keyword) {
    const domainAge = Math.floor(Math.random() * 15) + 1;
    const backlinks = Math.floor(Math.random() * 5000) + 10;
    const domainAuthority = Math.floor(Math.random() * 40) + 10;
    const trustFlow = Math.floor(Math.random() * 50) + 5;
    const citationFlow = Math.floor(Math.random() * 60) + 10;
    const referringDomains = Math.floor(Math.random() * 500) + 5;
    const monthlyTraffic = Math.floor(Math.random() * 10000);
    const dropDate = generateDropDate();

    return {
        name: domain,
        age: domainAge,
        backlinks,
        domainAuthority,
        trustFlow,
        citationFlow,
        referringDomains,
        monthlyTraffic,
        dropDate,
        price: calculateExpiredPrice(domain, domainAge, backlinks, domainAuthority, trustFlow),
        status: Math.random() > 0.3 ? 'available' : 'pending-delete',
        isTrending: Math.random() > 0.85,
        favorite: false,
    };
}

/**
 * Calculate price for expired domain with enhanced factors
 */
function calculateExpiredPrice(domain, age, backlinks, da, trustFlow) {
    let price = 10;

    price += age * 5;
    price += Math.min(backlinks / 10, 500);
    price += da * 2;
    price += trustFlow * 1.5;

    if (domain.endsWith('.com')) price *= 1.5;
    else if (domain.endsWith('.net')) price *= 1.2;
    else if (domain.endsWith('.org')) price *= 1.1;

    const baseName = domain.split('.')[0];
    if (baseName.length < 8) price *= 1.3;

    return Math.round(price);
}

/**
 * Generate a random drop date
 */
function generateDropDate() {
    const now = new Date();
    const offset = Math.floor(Math.random() * 60) - 30;
    const dropDate = new Date(now);
    dropDate.setDate(dropDate.getDate() + offset);

    if (offset < 0) {
        return `Dropped ${Math.abs(offset)} days ago`;
    } else if (offset === 0) {
        return 'Dropping today';
    } else {
        return `Dropping in ${offset} days`;
    }
}

/**
 * Shuffle array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Format number with K, M suffix
 */
export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Export domains to CSV
 */
export function exportToCSV(domains) {
    const headers = ['Domain', 'Age', 'DA', 'Backlinks', 'Trust Flow', 'Referring Domains', 'Traffic', 'Price', 'Status'];
    const rows = domains.map(d => [
        d.name,
        d.age,
        d.domainAuthority,
        d.backlinks,
        d.trustFlow,
        d.referringDomains,
        d.monthlyTraffic,
        d.price,
        d.status
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expired-domains-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}
