export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { productIds } = req.body;
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'Missing productIds' });
  }

  const domain = process.env.SHOPIFY_DOMAIN;
  const token  = process.env.SHOPIFY_ADMIN_TOKEN;

  try {
    const results = await Promise.all(productIds.map(async function(gid) {
      const numericId = String(gid).split('/').pop();
      const r = await fetch(
        `https://${domain}/admin/api/2024-01/products/${numericId}/variants.json?fields=id`,
        { headers: { 'X-Shopify-Access-Token': token } }
      );
      const d = await r.json();
      const variantId = d.variants && d.variants[0] && d.variants[0].id;
      return { gid, variantId: variantId ? `gid://shopify/ProductVariant/${variantId}` : null };
    }));

    const map = {};
    results.forEach(function(r) { map[r.gid] = r.variantId; });
    return res.status(200).json({ variants: map });
  } catch (e) {
    console.error('[variant-ids]', e);
    return res.status(500).json({ error: e.message });
  }
}
