import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

async function callGemini(system: string, user: string): Promise<string> {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) throw new Error('GEMINI_API_KEY missing');
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-1.5-flash',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content || '').trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { mode, prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (mode === 'enhance') {
      const result = await callGemini(
        "You are a prompt engineer. Rewrite the user's prompt to be clearer, more specific, and more effective for an AI assistant. Keep the original intent. Respond with ONLY the rewritten prompt — no preamble, no quotes, no explanation.",
        prompt
      );
      return new Response(JSON.stringify({ result: result || prompt }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (mode === 'suggest') {
      const content = await callGemini(
        "You are an autocomplete engine. Given the user's partial prompt, return 3 short distinct completions that finish their thought. Respond with ONLY a JSON array of 3 strings, no markdown.",
        `Partial: "${prompt}"`
      );
      let suggestions: string[] = [];
      try {
        const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) suggestions = parsed.slice(0, 3).map(String);
      } catch { /* ignore */ }
      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid mode' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});