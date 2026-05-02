// Streaming chat proxy that calls Groq, OpenRouter, or Gemini DIRECTLY
// using the user's own API keys. No Lovable AI Gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// provider tag -> [endpoint, env-var, default model]
type ProviderCfg = { url: string; envKey: string; defaultModel: string; extraHeaders?: Record<string,string> };
const PROVIDERS: Record<string, ProviderCfg> = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    envKey: "GROQ_API_KEY",
    defaultModel: "llama-3.3-70b-versatile",
  },
  openrouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    envKey: "OPENROUTER_API_KEY",
    defaultModel: "meta-llama/llama-3.1-70b-instruct:free",
    extraHeaders: {
      "HTTP-Referer": "https://final-station.lovable.app",
      "X-Title": "AI Station",
    },
  },
  gemini: {
    // Gemini exposes an OpenAI-compatible endpoint
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    envKey: "GEMINI_API_KEY",
    defaultModel: "gemini-1.5-flash",
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method === "GET") {
    const status: Record<string, boolean> = {};
    for (const [name, cfg] of Object.entries(PROVIDERS)) {
      status[name] = !!Deno.env.get(cfg.envKey);
    }
    return json({ status: "ok", function: "ai-chat", providers: status });
  }

  try {
    const { messages, provider = "groq", model } = await req.json();
    const cfg = PROVIDERS[provider];
    if (!cfg) return json({ error: `Unknown provider: ${provider}` }, 400);

    const key = Deno.env.get(cfg.envKey);
    if (!key) return json({ error: `${cfg.envKey} not configured` }, 500);

    const upstream = await fetch(cfg.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...(cfg.extraHeaders || {}),
      },
      body: JSON.stringify({
        model: model || cfg.defaultModel,
        messages,
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => "");
      return json({ error: `${provider} ${upstream.status}: ${text.slice(0, 300)}` }, upstream.status || 502);
    }

    return new Response(upstream.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
