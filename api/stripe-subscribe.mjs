import Stripe from 'stripe';

// $32.99/tub/mo — subscription price. Set STRIPE_PRICE_ID env var in Vercel.
// Create in Stripe Dashboard → Products → Add price ($32.99 recurring monthly)
const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1TcVZuRsLEp3Bab3nkHcEEfY';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    email,
    qty = 1,
    flavors = [],
    variantMap = {},
    addonVariantIds = [],
    giftVariantIds = [],
    shopifyCheckoutUrl = null,
    source = 'lander'
  } = req.body;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = req.headers.origin || 'https://drinkmindor.com';

  // Build metadata for webhook fulfillment
  const meta = {
    source: 'lander-order-bump',
    qty: String(qty),
    flavors: Array.isArray(flavors) ? flavors.join(',') : String(flavors),
    addon_variant_ids: Array.isArray(addonVariantIds) ? addonVariantIds.join(',') : '',
    gift_variant_ids:  Array.isArray(giftVariantIds)  ? giftVariantIds.join(',')  : ''
  };
  Object.entries(variantMap).forEach(([flavor, variantId]) => {
    meta['variant_' + flavor] = String(variantId);
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    ...(email ? { customer_email: email } : {}),
    line_items: [{ price: PRICE_ID, quantity: Number(qty) || 1 }],
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
    // If addons/gifts were selected, pass Shopify checkout URL so subscribe-success can redirect
    success_url: shopifyCheckoutUrl
      ? `${origin}/subscribe-success?checkout=${encodeURIComponent(shopifyCheckoutUrl)}&session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/subscribe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${source === 'cognitive-lander' ? 'cognitive' : 'lander'}`,
    subscription_data: { metadata: meta }
    // No trial — first charge is immediate (Stripe IS the payment for tub 1)
  });

  return res.status(200).json({ url: session.url });
}
