// ── adaptED Lead Capture → Make.com ──

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const name = body.name || 'Not provided';
    const email = body.email || '';
    const tier = body.tier || 'unknown';
    const ts = body.ts || new Date().toISOString();

    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }

    await fetch('https://hook.us2.make.com/71zhbrmnl39bqead15tprpvqfc9vd6kw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, tier: tier, timestamp: ts, source: 'adaptED demo' })
    });

    console.log('Lead captured: ' + email + ' (' + tier + ')');
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

  } catch (err) {
    console.error('capture-lead error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
