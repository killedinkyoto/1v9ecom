export default async function handler(req, res) {
  const domain = process.env.SHOPIFY_DOMAIN;
  const token  = process.env.SHOPIFY_ADMIN_TOKEN;

  const productIds = [
    'gid://shopify/Product/9071829155995',
    'gid://shopify/Product/9071814148251',
    'gid://shopify/Product/9071773778075'
  ];

  const query = `{
    p0: product(id: "${productIds[0]}") { id title variants(first:1) { nodes { id } } }
    p1: product(id: "${productIds[1]}") { id title variants(first:1) { nodes { id } } }
    p2: product(id: "${productIds[2]}") { id title variants(first:1) { nodes { id } } }
  }`;

  try {
    const r = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query })
    });
    const text = await r.text();
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(`HTTP ${r.status}\n\nDOMAIN: ${domain}\nTOKEN: ${token ? token.slice(0,12) + '...' : 'MISSING'}\n\nRESPONSE:\n${text}`);
  } catch(e) {
    return res.status(500).send('ERROR: ' + e.message);
  }
}
