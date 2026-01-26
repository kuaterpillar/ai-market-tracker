/**
 * Affiliate Link Management System
 * Automatically converts tool links to affiliate links for monetization
 */

export interface AffiliateConfig {
  // Add your affiliate IDs here
  amazonAssociatesId?: string;
  impactPartnerId?: string;
  cjPublisherId?: string;
  shareASaleId?: string;
  // Generic tracking parameter
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const DEFAULT_CONFIG: AffiliateConfig = {
  utmSource: 'ai-marketing-tracker',
  utmMedium: 'referral',
  utmCampaign: 'tool-directory',
  // Add your affiliate IDs in .env:
  // NEXT_PUBLIC_AMAZON_ASSOCIATES_ID=your-id-20
  // NEXT_PUBLIC_IMPACT_PARTNER_ID=your-id
};

/**
 * Add UTM parameters and affiliate tracking to any URL
 */
export function addAffiliateTracking(
  originalUrl: string,
  toolName: string,
  config: AffiliateConfig = DEFAULT_CONFIG
): string {
  try {
    const url = new URL(originalUrl);

    // Add UTM parameters for tracking
    if (config.utmSource) url.searchParams.set('utm_source', config.utmSource);
    if (config.utmMedium) url.searchParams.set('utm_medium', config.utmMedium);
    if (config.utmCampaign) url.searchParams.set('utm_campaign', config.utmCampaign);

    // Add tool-specific tracking
    url.searchParams.set('ref', 'ai-tools-tracker');

    return url.toString();
  } catch (error) {
    console.error('Invalid URL for affiliate tracking:', originalUrl);
    return originalUrl;
  }
}

/**
 * Convert ProductHunt URLs to affiliate links
 * Join ProductHunt affiliate program for commission
 */
export function convertProductHuntLink(phUrl: string): string {
  try {
    const url = new URL(phUrl);

    // Add referral parameter (join PH affiliate program first)
    url.searchParams.set('ref', 'ai-tools-tracker');

    return url.toString();
  } catch {
    return phUrl;
  }
}

/**
 * Check if a tool has an affiliate program and generate appropriate link
 * This is a basic implementation - expand based on your affiliate partnerships
 */
export function getAffiliateLink(
  toolUrl: string,
  toolName: string,
  phUrl?: string
): { link: string; isAffiliate: boolean } {

  // If it's a ProductHunt link, track it
  if (phUrl) {
    return {
      link: convertProductHuntLink(phUrl),
      isAffiliate: false, // Set to true once you join PH affiliate program
    };
  }

  // Add tracking to the tool's website
  const trackedLink = addAffiliateTracking(toolUrl, toolName);

  return {
    link: trackedLink,
    isAffiliate: false, // Set to true when you have direct partnerships
  };
}

/**
 * Common affiliate networks to integrate
 * Add your IDs in environment variables
 */
export const AFFILIATE_NETWORKS = {
  // Software/SaaS tools
  impact: process.env.NEXT_PUBLIC_IMPACT_PARTNER_ID,
  cj: process.env.NEXT_PUBLIC_CJ_PUBLISHER_ID,
  shareASale: process.env.NEXT_PUBLIC_SHAREASALE_ID,

  // For physical products
  amazon: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_ID,

  // Referral programs (manual signup required)
  appsumo: process.env.NEXT_PUBLIC_APPSUMO_PARTNER_ID,
};

/**
 * Track affiliate clicks (send to analytics)
 */
export function trackAffiliateClick(toolName: string, destination: string) {
  // Google Analytics tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      event_category: 'Affiliate',
      event_label: toolName,
      value: destination,
    });
  }

  // You can also send to your own tracking endpoint
  console.log(`[Affiliate Click] ${toolName} -> ${destination}`);
}
