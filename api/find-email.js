// api/find-email.js
//
// This is a Vercel serverless function. It runs on Vercel's servers, not in
// the browser — so your Hunter.io API key stays hidden here and is never
// exposed to anyone using the website.
//
// The frontend calls: POST /api/find-email  with { firstName, lastName, domain }
// This function calls Hunter.io's Email Finder API and returns the result.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { firstName, lastName, domain, company } = req.body || {};

  if (!firstName || !lastName || (!domain && !company)) {
    return res.status(400).json({
      error: 'Missing required fields. Need firstName, lastName, and either domain or company.',
    });
  }

  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing HUNTER_API_KEY. Add it in your Vercel project settings under Environment Variables.',
    });
  }

  try {
    const params = new URLSearchParams({
      first_name: firstName,
      last_name: lastName,
      api_key: apiKey,
    });
    if (domain) params.append('domain', domain);
    else if (company) params.append('company', company);

    const hunterRes = await fetch(`https://api.hunter.io/v2/email-finder?${params.toString()}`);
    const data = await hunterRes.json();

    if (!hunterRes.ok) {
      return res.status(hunterRes.status).json({
        error: data?.errors?.[0]?.details || 'Hunter.io request failed.',
      });
    }

    const email = data?.data?.email || null;
    const score = data?.data?.score ?? null;

    return res.status(200).json({ email, score, raw: data?.data || null });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected server error: ' + err.message });
  }
}
