import Stripe from 'stripe';

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).json({ error: 'Missing stripe-signature header' });

  const rawBody = await readRawBody(req);
  let event;
  try {
    event = Stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] signature failed:', err.message);
    return res.status(400).json({ error: 'Signature verification failed' });
  }

  if (event.type !== 'invoice.payment_succeeded') {
    return res.status(200).json({ ok: true, skipped: event.type });
  }

  const invoice = event.data.object;
  if (!invoice.subscription) return res.status(200).json({ ok: true, note: 'not a subscription invoice' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const meta = subscription.metadata || {};

  const qty = parseInt(meta.qty) || 1;
  const flavors = (meta.flavors || 'sour-candy').split(',').filter(Boolean);
  const email = invoice.customer_email || '';

  // Try to get shipping address from the Stripe customer
  let shippingAddress = null;
  try {
    const customer = await stripe.customers.retrieve(invoice.customer);
    if (customer && customer.shipping && customer.shipping.address) {
      const a = customer.shipping.address;
      shippingAddress = {
        first_name: (customer.shipping.name || '').split(' ')[0] || '',
        last_name:  (customer.shipping.name || '').split(' ').slice(1).join(' ') || '',
        address1: a.line1 || '',
        address2: a.line2 || '',
        city:     a.city  || '',
        province: a.state || '',
        zip:      a.postal_code || '',
        country:  a.country || 'US'
      };
    }
  } catch (e) {
    console.error('[webhook] could not fetch customer shipping:', e.message);
  }

  // Build tub line items from flavor variant GIDs in metadata
  const lineCounts = {};
  flavors.forEach(function(flavor) {
    const variantGid = meta['variant_' + flavor];
    if (!variantGid) return;
    const numericId = variantGid.split('/').pop();
    lineCounts[numericId] = (lineCounts[numericId] || 0) + 1;
  });

  const lineItems = Object.entries(lineCounts).map(([variantId, quantity]) => ({
    variant_id: parseInt(variantId, 10),
    quantity
  }));

  // Add addons
  const addonGids = (meta.addon_variant_ids || '').split(',').filter(Boolean);
  addonGids.forEach(function(gid) {
    const numericId = gid.split('/').pop();
    if (numericId) lineItems.push({ variant_id: parseInt(numericId, 10), quantity: 1 });
  });

  // Add free gifts (at $0 — MINDORGIFT discount applied in Shopify)
  const giftGids = (meta.gift_variant_ids || '').split(',').filter(Boolean);
  giftGids.forEach(function(gid) {
    const numericId = gid.split('/').pop();
    if (numericId) lineItems.push({ variant_id: parseInt(numericId, 10), quantity: 1, price: '0.00' });
  });

  if (lineItems.length === 0) {
    console.error('[webhook] No variant IDs in metadata for sub', invoice.subscription);
    return res.status(200).json({ ok: true, note: 'no variant ids — check subscription metadata' });
  }

  const draftOrderPayload = {
    line_items: lineItems,
    email,
    note: 'Mindor Auto-Ship — Stripe sub ' + invoice.subscription + ' | Invoice ' + invoice.id,
    tags: 'subscription,auto-ship,mindor-monthly',
    send_receipt: true
  };

  if (shippingAddress) {
    draftOrderPayload.shipping_address = shippingAddress;
  }

  const shopifyRes = await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/admin/api/2024-01/draft_orders.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN
      },
      body: JSON.stringify({ draft_order: draftOrderPayload })
    }
  );

  if (!shopifyRes.ok) {
    const errText = await shopifyRes.text();
    console.error('[webhook] Shopify draft order failed:', errText);
    return res.status(500).json({ error: 'Shopify draft order creation failed' });
  }

  const shopifyData = await shopifyRes.json();
  console.log('[webhook] Draft order created:', shopifyData.draft_order?.id);
  return res.status(200).json({ ok: true, draftOrderId: shopifyData.draft_order?.id });
}
