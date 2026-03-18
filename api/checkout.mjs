import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    email,
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    items,
    subtotal,
    total,
    subscription,
  } = req.body;

  if (!email || !firstName || !lastName || !address || !city || !state || !zip || !items?.length) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabase.from('orders').insert({
    email,
    first_name: firstName,
    last_name: lastName,
    address,
    city,
    state,
    zip,
    items,
    subtotal,
    total,
    subscription: subscription || false,
    status: 'pending',
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to save order' });
  }

  return res.status(200).json({ success: true });
}
