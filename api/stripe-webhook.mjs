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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // ── checkout.session.completed ────────────────────────────────────────────
  // Fires once when customer finishes Stripe Checkout.
  // We save shipping address + flavor into subscription metadata so every
  // future invoice.payment_succeeded can fulfill with the right details.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (!session.subscription) return res.status(200).json({ ok: true, note: 'no subscription on session' });

    const shipping = session.shipping_details;
    const metaUpdate = {};

    if (shipping && shipping.address) {
      const a = shipping.address;
      metaUpdate['ship_name']     = shipping.name || '';
      metaUpdate['ship_line1']    = a.line1 || '';
      metaUpdate['ship_line2']    = a.line2 || '';
      metaUpdate['ship_city']     = a.city  || '';
      metaUpdate['ship_state']    = a.state || '';
      metaUpdate['ship_zip']      = a.postal_code || '';
      metaUpdate['ship_country']  = a.country || 'US';
    }

    if (Object.keys(metaUpdate).length > 0) {
      await stripe.subscriptions.update(session.subscription, {
        metadata: metaUpdate
      });
      console.log('[webhook] saved shipping to subscription', session.subscription);
    }

    return res.status(200).json({ ok: true });
  }

  // ── invoice.payment_succeeded ─────────────────────────────────────────────
  // Fires on every successful charge (month 1, 2, 3…).
  // Creates a Shopify draft order so you can fulfill it.
  if (event.type !== 'invoice.payment_succeeded') {
    return res.status(200).json({ ok: true, skipped: event.type });
  }

  const invoice = event.data.object;
  if (!invoice.subscription) return res.status(200).json({ ok: true, note: 'not a subscription invoice' });

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const meta = subscription.metadata || {};

  const qty     = parseInt(meta.qty) || 1;
  const flavors = (meta.flavors || 'sour-candy').split(',').filter(Boolean);
  const email   = invoice.customer_email || '';

  // Build tub line items
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
  (meta.addon_variant_ids || '').split(',').filter(Boolean).forEach(function(gid) {
    const id = gid.split('/').pop();
    if (id) lineItems.push({ variant_id: parseInt(id, 10), quantity: 1 });
  });

  // Add free gifts at $0
  (meta.gift_variant_ids || '').split(',').filter(Boolean).forEach(function(gid) {
    const id = gid.split('/').pop();
    if (id) lineItems.push({ variant_id: parseInt(id, 10), quantity: 1, price: '0.00' });
  });

  if (lineItems.length === 0) {
    console.error('[webhook] no variant IDs for sub', invoice.subscription);
    return res.status(200).json({ ok: true, note: 'no variant ids' });
  }

  // Build shipping address from metadata saved at checkout.session.completed
  let shippingAddress = null;
  if (meta.ship_line1) {
    const nameParts = (meta.ship_name || '').split(' ');
    shippingAddress = {
      first_name: nameParts[0] || '',
      last_name:  nameParts.slice(1).join(' ') || '',
      address1:   meta.ship_line1 || '',
      address2:   meta.ship_line2 || '',
      city:       meta.ship_city  || '',
      province:   meta.ship_state || '',
      zip:        meta.ship_zip   || '',
      country:    meta.ship_country || 'US'
    };
  }

  const flavorLabel = flavors.map(f => f.replace(/-/g, ' ')).join(', ');
  const note = [
    'Mindor Auto-Ship — Stripe sub ' + invoice.subscription,
    'Invoice: ' + invoice.id,
    'Flavor(s): ' + flavorLabel,
    'Qty: ' + qty
  ].join(' | ');

  const draftPayload = {
    line_items: lineItems,
    email,
    note,
    tags: 'subscription,auto-ship,mindor-monthly',
    send_receipt: true,
    ...(shippingAddress ? { shipping_address: shippingAddress } : {})
  };

  const shopifyRes = await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/admin/api/2024-01/draft_orders.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN
      },
      body: JSON.stringify({ draft_order: draftPayload })
    }
  );

  if (!shopifyRes.ok) {
    const errText = await shopifyRes.text();
    console.error('[webhook] Shopify draft order failed:', errText);
    return res.status(500).json({ error: 'Shopify draft order failed' });
  }

  const shopifyData = await shopifyRes.json();
  console.log('[webhook] Draft order created:', shopifyData.draft_order?.id, '| flavor:', flavorLabel);
  return res.status(200).json({ ok: true, draftOrderId: shopifyData.draft_order?.id });
}
