import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Body {
  provider: 'groq' | 'gemini' | 'openrouter';
  model: string;
  messages: { role: string; content: string }[];
}

const ENDPOINTS = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
};

const KEY_NAMES = {
  groq: 'GROQ_API_KEY',
  gemini: 'GEMINI_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    if (!body?.provider || !body?.model || !Array.isArray(body?.messages)) {
      return new Response(JSON.stringify({ error: 'Invalid body' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const endpoint = ENDPOINTS[body.provider];
    const key = Deno.env.get(KEY_NAMES[body.provider]);
    if (!endpoint || !key) {
      return new Response(JSON.stringify({ error: `Provider ${body.provider} not configured` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    };
    if (body.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://final-station.lovable.app';
      headers['X-Title'] = 'AI Station';
    }

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: body.model, messages: body.messages, stream: true }),
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => '');
      return new Response(JSON.stringify({ error: `Upstream ${upstream.status}: ${text.slice(0, 300)}` }), {
        status: upstream.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});