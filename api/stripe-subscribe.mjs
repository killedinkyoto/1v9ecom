import Stripe from 'stripe';

const PRICE_ID = 'price_1TbIHyRsLEp3Bab3xcR3R3jv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, shopifyCheckoutUrl } = req.body;

  if (!shopifyCheckoutUrl) {
    return res.status(400).json({ error: 'Missing shopifyCheckoutUrl' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const origin = req.headers.origin || 'https://drinkmindor.com';
  const encodedCart = encodeURIComponent(shopifyCheckoutUrl);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    ...(email ? { customer_email: email } : {}),
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${origin}/subscribe-success?checkout=${encodedCart}&session_id={CHECKOUT_SESSION_ID}`,
    // If they cancel Stripe, send them straight to Shopify so they still complete the main order
    cancel_url: shopifyCheckoutUrl,
    subscription_data: {
      metadata: { source: 'lander-order-bump' }
    }
  });

  return res.status(200).json({ url: session.url });
}
