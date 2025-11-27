/**
 * RDAP Domain Availability Checker - STRICT MODE
 * Critical Fix: Prevents False Positives
 * 
 * STRICT RULES:
 * - Default state is "unknown" or "taken", NEVER "available"
 * - Only mark "available" if RDAP returns HTTP 404
 * - Any HTTP 200 (even with "expired" status) = TAKEN
 * - Any error (network, CORS, rate limit) = UNKNOWN
 */

const RDAP_BASE_URL = 'https://rdap.org/domain/';

/**
 * Check domain availability using RDAP protocol with STRICT validation
 * @param {string} domain - Domain name to check
 * @returns {Promise<{status: string, available: boolean|null, message: string}>}
 */
export async function checkAvailability(domain) {
    // Validate input
    if (!domain || typeof domain !== 'string') {
        return {
            status: 'error',
            available: null,
            message: 'Invalid domain name',
            needsManualVerification: false
        };
    }

    const cleanDomain = domain.trim().toLowerCase();

    try {
        const response = await fetch(`${RDAP_BASE_URL}${cleanDomain}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/rdap+json',
            },
        });

        // STRICT RULE 1: HTTP 404 = AVAILABLE (Only case where available = true)
        if (response.status === 404) {
            return {
                status: 'available',
                available: true,
                message: 'Domain is available for registration',
                needsManualVerification: true // Always recommend manual verification
            };
        }

        // STRICT RULE 2: HTTP 200 = TAKEN (Even if JSON says "expired")
        // Reason: Domain in redemption period or pending delete cannot be registered
        if (response.status === 200) {
            try {
                const data = await response.json();

                // Check if domain is truly expired or in grace period
                const status = data.status || [];
                const isExpired = status.some(s =>
                    s.toLowerCase().includes('expired') ||
                    s.toLowerCase().includes('redemption') ||
                    s.toLowerCase().includes('pending delete')
                );

                if (isExpired) {
                    return {
                        status: 'taken',
                        available: false,
                        message: 'Domain is in redemption/pending delete period (not available yet)',
                        needsManualVerification: false,
                        rdapStatus: status.join(', ')
                    };
                }

                return {
                    status: 'taken',
                    available: false,
                    message: 'Domain is registered and taken',
                    needsManualVerification: false
                };
            } catch (jsonError) {
                // If we can't parse JSON but got 200, domain record exists = TAKEN
                return {
                    status: 'taken',
                    available: false,
                    message: 'Domain record exists (taken)',
                    needsManualVerification: false
                };
            }
        }

        // STRICT RULE 3: HTTP 429 (Rate Limit) = UNKNOWN (NOT available!)
        if (response.status === 429) {
            return {
                status: 'unknown',
                available: null,
                message: 'Rate limited. Please retry later.',
                canRetry: true,
                needsManualVerification: false
            };
        }

        // STRICT RULE 4: HTTP 5xx (Server Error) = UNKNOWN (NOT available!)
        if (response.status >= 500) {
            return {
                status: 'unknown',
                available: null,
                message: 'RDAP server error. Please retry.',
                canRetry: true,
                needsManualVerification: false
            };
        }

        // STRICT RULE 5: Any other status code = UNKNOWN (NOT available!)
        return {
            status: 'unknown',
            available: null,
            message: `Unexpected response: ${response.status}`,
            canRetry: true,
            needsManualVerification: false
        };

    } catch (error) {
        // CRITICAL FIX: Network errors, CORS, timeouts = UNKNOWN (NOT available!)
        // This was the bug - catch block was defaulting to "available"

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            return {
                status: 'unknown',
                available: null,
                message: 'Network error or CORS blocked. Cannot verify.',
                canRetry: true,
                needsManualVerification: true
            };
        }

        if (error.name === 'AbortError') {
            return {
                status: 'unknown',
                available: null,
                message: 'Request timeout. Please retry.',
                canRetry: true,
                needsManualVerification: false
            };
        }

        // Any other error = UNKNOWN
        return {
            status: 'unknown',
            available: null,
            message: `Error: ${error.message}`,
            canRetry: true,
            needsManualVerification: true
        };
    }
}

/**
 * Mock checker for demo purposes (when RDAP fails)
 * IMPORTANT: Also uses strict logic - defaults to unknown, not available
 */
export async function mockCheckAvailability(domain) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    const cleanDomain = domain.trim().toLowerCase();

    // Simulate ~70% taken rate (realistic for expired domains)
    const randomValue = Math.random();

    if (randomValue < 0.70) {
        return {
            status: 'taken',
            available: false,
            message: 'Domain is registered (simulated)',
            needsManualVerification: false
        };
    } else if (randomValue < 0.85) {
        return {
            status: 'available',
            available: true,
            message: 'Domain appears available (simulated - verify manually!)',
            needsManualVerification: true
        };
    } else {
        return {
            status: 'unknown',
            available: null,
            message: 'Cannot verify (simulated error)',
            canRetry: true,
            needsManualVerification: true
        };
    }
}

/**
 * Batch check multiple domains with rate limiting
 * @param {string[]} domains - Array of domain names
 * @param {number} delayMs - Delay between requests (default: 500ms)
 * @returns {Promise<Array>}
 */
export async function batchCheckAvailability(domains, delayMs = 500) {
    const results = [];

    for (let i = 0; i < domains.length; i++) {
        try {
            const result = await checkAvailability(domains[i]);
            results.push({
                domain: domains[i],
                ...result
            });
        } catch (error) {
            results.push({
                domain: domains[i],
                status: 'unknown',
                available: null,
                message: 'Check failed',
                canRetry: true,
                needsManualVerification: true
            });
        }

        // Rate limiting delay (except for last item)
        if (i < domains.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return results;
}
