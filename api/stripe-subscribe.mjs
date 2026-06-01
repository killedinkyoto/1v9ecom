import Stripe from 'stripe';

// Pricing mirrors the cognitive lander widget
const BASE = 32.99;
const BUNDLE_DISC = { 1: 0, 2: 0.10, 3: 0.15 };
const SUB_DISC = 0.15;

function calcTotal(qty) {
  const n = Number(qty) || 1;
  const afterBundle = BASE * n * (1 - (BUNDLE_DISC[n] || 0));
  return Math.round(afterBundle * (1 - SUB_DISC) * 100); // cents, already includes 15% sub discount
}

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
    source,
    qty: String(qty),
    flavors: Array.isArray(flavors) ? flavors.join(',') : String(flavors),
    addon_variant_ids: Array.isArray(addonVariantIds) ? addonVariantIds.join(',') : '',
    gift_variant_ids:  Array.isArray(giftVariantIds)  ? giftVariantIds.join(',')  : ''
  };
  Object.entries(variantMap).forEach(([flavor, variantId]) => {
    meta['variant_' + flavor] = String(variantId);
  });

  // Use price_data so the correct bundle-discounted total is charged for any qty.
  // quantity: 1 with the exact total amount avoids Stripe multiplying unit price × qty.
  const totalCents = calcTotal(qty);
  const qtyNum = Number(qty) || 1;
  const perTubDisplay = (totalCents / 100 / qtyNum).toFixed(2);
  const productName = qtyNum === 1
    ? 'Mindor Performance Stack — 1 Tub'
    : `Mindor Performance Stack — ${qtyNum} Tubs`;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    ...(email ? { customer_email: email } : {}),
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: productName,
          description: `$${perTubDisplay}/tub · monthly auto-ship · cancel any time`
        },
        unit_amount: totalCents,
        recurring: { interval: 'month' }
      },
      quantity: 1
    }],
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
    success_url: shopifyCheckoutUrl
      ? `${origin}/subscribe-success?checkout=${encodeURIComponent(shopifyCheckoutUrl)}&session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/subscribe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${source === 'cognitive-lander' ? 'fb/lander/RW' : 'lander'}`,
    subscription_data: { metadata: meta }
  });

  return res.status(200).json({ url: session.url });
}
