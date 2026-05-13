/**
 * AdaptED Activity Vault — License Verification API
 * Deployed on Vercel at /api/verify
 *
 * POST /api/verify
 * Body: { key: "LICENSE-KEY-HERE" }
 * Returns: { success, tier, tierName, level, email, message }
 *
 * Environment variables required:
 *   GR_API_KEY     — Gumroad API key (Settings → Advanced → Applications)
 *   GR_ID_STARTER  — Gumroad product ID for Starter ($27)
 *   GR_ID_PRO      — Gumroad product ID for Pro ($97)
 *   GR_ID_ELITE    — Gumroad product ID for Elite ($197)
 *   GR_ID_SCHOOL   — Gumroad product ID for School ($497)
 */

function buildTierMap() {
  return {
    [process.env.GR_ID_STARTER]: { tier: 'starter', tierName: 'Starter', level: 1 },
    [process.env.GR_ID_PRO]:     { tier: 'pro',     tierName: 'Pro',     level: 2 },
    [process.env.GR_ID_ELITE]:   { tier: 'elite',   tierName: 'Elite',   level: 3 },
    [process.env.GR_ID_SCHOOL]:  { tier: 'school',  tierName: 'School',  level: 4 },
  };
}

const GUMROAD_VERIFY = 'https://api.gumroad.com/v2/licenses/verify';

function getProductIds() {
  return [
    process.env.GR_ID_STARTER,
    process.env.GR_ID_PRO,
    process.env.GR_ID_ELITE,
    process.env.GR_ID_SCHOOL,
  ].filter(Boolean);
}

async function tryVerify(productId, licenseKey, apiKey) {
  try {
    const body = new URLSearchParams({
      product_id: productId,
      license_key: licenseKey.trim().toUpperCase(),
    });
    const res = await fetch(GUMROAD_VERIFY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: body.toString(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { key } = req.body || {};
  if (!key || typeof key !== 'string' || key.trim().length < 4) {
    return res.status(400).json({ success: false, message: 'License key is required.' });
  }

  const apiKey = process.env.GR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, message: 'Server configuration error. Contact support.' });
  }

  const productIds = getProductIds();
  const tierMap = buildTierMap();

  for (const productId of productIds) {
    const result = await tryVerify(productId, key, apiKey);
    if (!result) continue;

    if (result.success) {
      const tierInfo = tierMap[productId];
      if (!tierInfo) continue;
      const purchase = result.purchase || {};
      return res.status(200).json({
        success: true,
        tier: tierInfo.tier,
        tierName: tierInfo.tierName,
        level: tierInfo.level,
        email: purchase.email || '',
        uses: result.uses || 1,
        message: `Welcome! Your ${tierInfo.tierName} license is active.`,
      });
    }

    const msg = (result.message || '').toLowerCase();
    if (msg.includes('refunded')) {
      return res.status(200).json({ success: false, message: 'This license was refunded and is no longer active.' });
    }
    if (msg.includes('chargeback')) {
      return res.status(200).json({ success: false, message: 'This license is no longer valid. Contact support.' });
    }
  }

  return res.status(200).json({
    success: false,
    message: 'License key not found. Double-check your key or contact support.',
  });
}
