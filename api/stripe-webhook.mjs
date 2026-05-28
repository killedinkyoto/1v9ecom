import Stripe from 'stripe';

// Vercel: disable body parsing so we get the raw body for webhook signature verification
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

  // Only process successful subscription invoice payments (monthly renewals + first charge)
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

  // Build line items using variant GIDs stored at subscription creation time
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

  if (lineItems.length === 0) {
    console.error('[webhook] No variant IDs in metadata for sub', invoice.subscription);
    return res.status(200).json({ ok: true, note: 'no variant ids — check subscription metadata' });
  }

  // Create a Shopify draft order — admin will see it and can mark fulfilled + add shipping
  const shopifyRes = await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/admin/api/2024-01/draft_orders.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN
      },
      body: JSON.stringify({
        draft_order: {
          line_items: lineItems,
          email,
          note: 'Mindor Auto-Ship renewal — Stripe sub ' + invoice.subscription + ' | Invoice ' + invoice.id,
          tags: 'subscription,auto-ship,mindor-monthly',
          send_receipt: true
        }
      })
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
