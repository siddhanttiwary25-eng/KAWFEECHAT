// api/tweak-draft.js
//
// Takes a drafted email (subject + body) and a free-text instruction
// ("make it more casual", "mention I'm a recent grad", etc.) and asks
// Claude to rewrite the email accordingly. Your Anthropic API key stays
// on the server here — never exposed to the browser.
//
// POST /api/tweak-draft  with { subject, body, instruction }

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

  const { subject, body, instruction } = req.body || {};

  if (!subject || !body || !instruction) {
    return res.status(400).json({ error: 'Missing required fields: subject, body, instruction.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing ANTHROPIC_API_KEY. Add it in your Vercel project settings under Environment Variables.',
    });
  }

  const prompt = `You are editing a short outreach email requesting a coffee chat. Here is the current draft:

Subject: ${subject}

Body:
${body}

The sender wants this change: "${instruction}"

Rewrite the email applying that change. Keep it concise and natural, keep the same overall structure and intent (requesting a brief coffee chat), and don't invent new facts about the sender or recipient that weren't in the original draft. Respond with ONLY valid JSON in this exact format, with no other text before or after:
{"subject": "...", "body": "..."}`;

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await claudeRes.json();

    if (!claudeRes.ok) {
      return res.status(claudeRes.status).json({
        error: data?.error?.message || 'Claude API request failed.',
      });
    }

    const textBlock = (data.content || []).find(b => b.type === 'text');
    if (!textBlock) {
      return res.status(500).json({ error: 'No text response from Claude.' });
    }

    let cleaned = textBlock.text.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'Could not parse Claude\'s response as JSON.', raw: textBlock.text });
    }

    if (!parsed.subject || !parsed.body) {
      return res.status(500).json({ error: 'Claude\'s response was missing subject or body.', raw: textBlock.text });
    }

    return res.status(200).json({ subject: parsed.subject, body: parsed.body });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected server error: ' + err.message });
  }
}
