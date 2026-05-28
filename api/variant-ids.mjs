export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { productIds } = req.body;
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'Missing productIds' });
  }

  const domain = process.env.SHOPIFY_DOMAIN;
  const token  = process.env.SHOPIFY_ADMIN_TOKEN;

  if (!domain || !token) {
    return res.status(500).json({ error: 'Missing SHOPIFY_DOMAIN or SHOPIFY_ADMIN_TOKEN env vars' });
  }

  // Use Admin GraphQL API — works with atkn_ token format
  const query = `{
    ${productIds.map((gid, i) => `
      p${i}: product(id: "${gid}") {
        id
        variants(first: 1) { nodes { id } }
      }
    `).join('\n')}
  }`;

  try {
    const r = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ query })
    });

    const raw = await r.text();
    console.log('[variant-ids] status:', r.status, 'body:', raw.slice(0, 500));

    if (!r.ok) {
      return res.status(500).json({ error: `Shopify returned ${r.status}`, detail: raw.slice(0, 300) });
    }

    const data = JSON.parse(raw);

    if (data.errors) {
      return res.status(500).json({ error: 'GraphQL errors', detail: data.errors });
    }

    const map = {};
    productIds.forEach((gid, i) => {
      const p = data.data && data.data[`p${i}`];
      map[gid] = p && p.variants.nodes[0] ? p.variants.nodes[0].id : null;
    });

    return res.status(200).json({ variants: map });
  } catch (e) {
    console.error('[variant-ids]', e);
    return res.status(500).json({ error: e.message });
  }
}
