/**
 * localStorage utility for managing saved/favorite domains
 */

export interface SavedDomain {
    domain: string;
    value: number;
    savedAt: string; // ISO timestamp
}

const STORAGE_KEY = 'domainhunter_saved_domains';

/**
 * Get all saved domains from localStorage
 */
export function getSavedDomains(): SavedDomain[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];
        return JSON.parse(saved) as SavedDomain[];
    } catch (error) {
        console.error('Error reading saved domains:', error);
        return [];
    }
}

/**
 * Check if a domain is saved
 */
export function isDomainSaved(domain: string): boolean {
    const saved = getSavedDomains();
    return saved.some(d => d.domain.toLowerCase() === domain.toLowerCase());
}

/**
 * Save a domain to favorites
 */
export function saveDomain(domain: string, value: number): void {
    try {
        const saved = getSavedDomains();

        // Check if already saved
        if (isDomainSaved(domain)) {
            return;
        }

        const newDomain: SavedDomain = {
            domain,
            value,
            savedAt: new Date().toISOString()
        };

        saved.push(newDomain);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (error) {
        console.error('Error saving domain:', error);
    }
}

/**
 * Remove a domain from favorites
 */
export function removeSavedDomain(domain: string): void {
    try {
        const saved = getSavedDomains();
        const filtered = saved.filter(d => d.domain.toLowerCase() !== domain.toLowerCase());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error removing saved domain:', error);
    }
}

/**
 * Toggle domain saved status
 */
export function toggleSavedDomain(domain: string, value: number): boolean {
    if (isDomainSaved(domain)) {
        removeSavedDomain(domain);
        return false;
    } else {
        saveDomain(domain, value);
        return true;
    }
}

/**
 * Clear all saved domains
 */
export function clearAllSavedDomains(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing saved domains:', error);
    }
}

/**
 * Export saved domains to CSV format
 */
export function exportSavedDomainsToCSV(): void {
    const saved = getSavedDomains();

    if (saved.length === 0) {
        alert('No saved domains to export');
        return;
    }

    // Create CSV content
    const headers = ['Domain', 'Estimated Value', 'Saved Date'];
    const rows = saved.map(d => [
        d.domain,
        `$${d.value.toLocaleString('en-US')}`,
        new Date(d.savedAt).toLocaleDateString()
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'domain-hunter-export.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
