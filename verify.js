// Netlify Function — Gumroad License Verification
const https = require('https');
const querystring = require('querystring');

const PRODUCTS = {
  dnrur:  'starter',
  kbylil: 'pro',
  zhmhbv: 'elite',
  muyuj:  'school',
};

function gumroadVerify(productPermalink, licenseKey) {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      product_permalink: productPermalink,
      license_key: licenseKey,
      increment_uses_count: 'false',
    });
    const options = {
      hostname: 'api.gumroad.com',
      path: '/v2/licenses/verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { resolve({ success: false }); }
      });
    });
    req.on('error', () => resolve({ success: false }));
    req.setTimeout(8000, () => { req.destroy(); resolve({ success: false }); });
    req.write(postData);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ success: false }) };

  let key = '';
  try { key = (JSON.parse(event.body || '{}').key || '').trim(); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid request' }) }; }

  if (!key) return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'No key provided' }) };

  // Owner bypass
  if (key.toUpperCase() === 'LAZYCREATOR-OWNER-2025') {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, tier: 'school', email: '' }) };
  }

  // Try each product
  for (const [productId, tier] of Object.entries(PRODUCTS)) {
    const result = await gumroadVerify(productId, key);
    if (result && result.success) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, tier, email: result.purchase?.email || '' }),
      };
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: false, message: 'Invalid license key. Check your purchase email and try again.' }),
  };
};
