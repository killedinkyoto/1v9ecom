import Stripe from 'stripe';

// $25.49/tub/mo recurring price — create in Stripe Dashboard → Products → Add price
// Set STRIPE_PRICE_ID env var in Vercel, or replace the fallback below
const PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1Tc5aZRsLEp3Bab3OgURKLaR';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, shopifyCheckoutUrl, qty = 1, flavors = [], variantMap = {} } = req.body;

  if (!shopifyCheckoutUrl) {
    return res.status(400).json({ error: 'Missing shopifyCheckoutUrl' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = req.headers.origin || 'https://drinkmindor.com';
  const encodedCart = encodeURIComponent(shopifyCheckoutUrl);

  // Store qty + flavor + variant data in metadata so the webhook can create Shopify orders
  const meta = {
    source: 'lander-order-bump',
    qty: String(qty),
    flavors: Array.isArray(flavors) ? flavors.join(',') : String(flavors)
  };
  Object.entries(variantMap).forEach(([flavor, variantId]) => {
    meta['variant_' + flavor] = String(variantId);
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    ...(email ? { customer_email: email } : {}),
    // quantity × $25.49 = total monthly charge (e.g. 2 tubs = $50.98/mo)
    line_items: [{ price: PRICE_ID, quantity: Number(qty) || 1 }],
    success_url: `${origin}/subscribe-success?checkout=${encodedCart}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: shopifyCheckoutUrl,
    subscription_data: { metadata: meta }
  });

  return res.status(200).json({ url: session.url });
}
