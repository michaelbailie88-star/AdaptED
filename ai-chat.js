// ── adaptED AI Planning Assistant — Google Gemini Flash (free tier) ──

function buildSystemPrompt(ctx) {
  const brand = (ctx && ctx.brand) || 'AdaptED';
  const age = (ctx && ctx.age) || 'all ages';
  return `You are an AI activity planning assistant built into the adaptED Activity Vault by The Lazy Creator. You help educators, camp counselors, OTs, therapists, and parents plan engaging activity sessions.

THE VAULT CONTAINS:
- AdaptED: 1,613+ activities for educators (ages 0-12). Movement, sensory, literacy, maths, science, art, social-emotional
- CampED: 787+ activities for camp (ages 6-16). Icebreakers, team building, outdoor games, nature crafts, adventure
- TeenagED: 324+ activities for teens (ages 11-18). Life skills, STEM, creative arts, mindfulness
- RegulatED: 229+ regulation activities (all ages). Proprioceptive, vestibular, deep pressure, breathing, co-regulation
- ParentED: Parenting strategies and home activity guides

CURRENT CONTEXT: ${brand} module, ${age} age group

RESPONSE RULES:
- Warm, practical educator-to-educator tone
- Clear sections with emojis and bullet points
- Day plan: 4-5 activities with timing slots and energy levels
- Week plan: Mon-Fri, 3-4 activities per day, varied energy
- Material-based: suggest 3-5 activities matching given materials
- Always include: age range, energy level, materials needed
- End with one tip
- Keep under 300 words unless full week plan`;
}

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
    const messages = body.messages || [];
    const context = body.context || {};

    const systemPrompt = buildSystemPrompt(context);
    const msgList = messages.length ? messages : [{ role: 'user', content: 'Hello' }];

    const contents = msgList.slice(-12).map(function(m) {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      };
    });

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBcLEeK_rX3edwXIpFsgaOKffgr-VO4Duc',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Gemini error:', JSON.stringify(data.error));
      return { statusCode: 500, headers, body: JSON.stringify({ error: data.error.message }) };
    }

    const reply = (data.candidates &&
                   data.candidates[0] &&
                   data.candidates[0].content &&
                   data.candidates[0].content.parts &&
                   data.candidates[0].content.parts[0] &&
                   data.candidates[0].content.parts[0].text) || 'Try again!';

    return { statusCode: 200, headers, body: JSON.stringify({ reply: reply }) };

  } catch (err) {
    console.error('ai-chat error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
