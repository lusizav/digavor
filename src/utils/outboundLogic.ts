/**
 * Outbound Sales & Automation Logic
 * Based on Brady (@ntropiq) domain flipping strategies
 */

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    description: string;
}

/**
 * Brady's Hot Keywords - Expert-traded domain keywords
 */
export const TRENDING_KEYWORDS = [
    "Agent",
    "Flow",
    "Base",
    "Sync",
    "Mind",
    "Scale",
    "Hub",
    "Lab",
    "Ops"
];

/**
 * Cold Email Templates for Outbound Sales
 */
export const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: "direct",
        name: "Direct Approach",
        subject: "{domainName}",
        body: `Hi [Name],

I noticed you're running [Company], and I own the domain {domainName}.

It matches your brand perfectly and would be a great upgrade.

Are you open to discussing an acquisition price?

Best,`,
        description: "Straightforward acquisition offer"
    },
    {
        id: "upgrade",
        name: "The Upgrade",
        subject: "Upgrade for [Company]",
        body: `Hi [Name],

Quick question - have you considered upgrading to {domainName}?

It's shorter, more authoritative, and protects your brand.

Let me know if you'd like the price.

Thanks,`,
        description: "Focus on brand improvement value"
    },
    {
        id: "strategic",
        name: "Strategic Advantage",
        subject: "Premium Domain for [Company]",
        body: `Hi [Name],

I noticed [Company] is growing fast. Congrats!

I own {domainName} and think it would give you a competitive edge:

✓ Better SEO rankings
✓ Stronger brand authority  
✓ Prevents competitors from getting it

Interested in discussing?

Best,`,
        description: "Emphasize competitive advantage"
    }
];

/**
 * Generate email from template with domain info
 */
export function generateEmail(templateId: string, domain: string): { subject: string; body: string } | null {
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (!template) return null;

    const domainKeyword = domain.split('.')[0] || domain;

    const subject = template.subject
        .replace(/{domainName}/g, domain)
        .replace(/{domainKeyword}/g, domainKeyword);

    const body = template.body
        .replace(/{domainName}/g, domain)
        .replace(/{domainKeyword}/g, domainKeyword);

    return { subject, body };
}

/**
 * Get full email text (subject + body) for clipboard
 */
export function getFullEmailText(templateId: string, domain: string): string {
    const email = generateEmail(templateId, domain);
    if (!email) return '';

    return `Subject: ${email.subject}

${email.body}`;
}

/**
 * Generate Google search URL for inferior extensions
 * Finds companies using weaker TLDs who might want to upgrade
 */
export function getInferiorExtensionSearchUrl(domain: string): string {
    const parts = domain.split('.');
    const domainKeyword = parts[0] || domain;
    const currentTld = parts.length > 1 ? '.' + parts[parts.length - 1] : '.com';

    // Build search query to find inferior extensions
    // Example: "techagent" -site:.com (site:.net OR site:.org OR site:.co OR site:.io)
    const inferiorTlds = ['.net', '.org', '.co', '.io', '.xyz', '.online', '.tech'];
    const tldQuery = inferiorTlds
        .filter(tld => tld !== currentTld)
        .map(tld => `site:${tld}`)
        .join(' OR ');

    const searchQuery = `"${domainKeyword}" -site:${currentTld} (${tldQuery})`;

    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
}

/**
 * Generate "Find Buyers" Google search URL
 * Searches for companies/brands that match the domain keyword
 */
export function getBuyerSearchUrl(domain: string): string {
    const domainKeyword = domain.split('.')[0] || domain;
    const searchQuery = `"${domainKeyword}" (company OR startup OR brand OR business)`;

    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
}
