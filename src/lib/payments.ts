/**
 * Live money switches. Empty = capture a lead. Paste Stripe Payment Links
 * (Dashboard → Payment Links) and the shop buttons charge for real.
 * Never commit secret keys. Payment Links are public URLs.
 */
export const STRIPE_PAYMENT_LINKS: Record<string, string> = {
  "desk-light": "",
  "desk-plus": "",
  "desk-patron": "",
  "tee-true": "",
  "print-card": "",
  "tip-3": "",
  "tip-7": "",
  "tip-21": "",
  "ads-week": "",
  "ads-month": "",
  "ads-cup": "",
};

/** Google AdSense / Ad Manager. Empty = dummy labeled creatives. */
export const ADSENSE = {
  client: "", // e.g. "ca-pub-1234567890123456"
  slots: {
    leaderboard: "",
    inarticle: "",
    sidebar: "",
    native: "",
    anchor: "",
  } as Record<string, string>,
};

export function stripeLink(sku: string): string | null {
  const url = STRIPE_PAYMENT_LINKS[sku];
  return url && url.startsWith("https://buy.stripe.com/") ? url : null;
}

export function adsenseReady(): boolean {
  return ADSENSE.client.startsWith("ca-pub-") && ADSENSE.client.length > 12;
}
