import Stripe from 'stripe';

// $28.04/tub/mo — 15% off $32.99. Create in Stripe Dashboard → Products → Add price
// Set STRIPE_PRICE_ID env var in Vercel, or replace the fallback below
const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1TcVZuRsLEp3Bab3nkHcEEfY';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    email,
    qty = 1,
    flavors = [],
    variantMap = {},
    addonVariantIds = [],
    giftVariantIds = []
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
    // Collect shipping so webhook can fulfill the first order
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
    success_url: `${origin}/subscribe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${origin}/lander`,
    subscription_data: { metadata: meta }
    // No trial — first charge is immediate (Stripe IS the payment for tub 1)
  });

  return res.status(200).json({ url: session.url });
}
