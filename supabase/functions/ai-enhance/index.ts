// Prompt enhancer + autocomplete suggestions via Lovable AI Gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method === "GET") {
    return new Response(JSON.stringify({ status: "ok", function: "ai-enhance", hasKey: !!Deno.env.get("LOVABLE_API_KEY") }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { mode, prompt } = await req.json();
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let system = "";
    let user = "";

    if (mode === "enhance") {
      system = "You are a prompt engineer. Rewrite the user's prompt to be clearer, more specific, and more effective for an AI assistant. Keep the original intent. Respond with ONLY the rewritten prompt — no preamble, no quotes, no explanation.";
      user = prompt;
    } else if (mode === "suggest") {
      system = "You are an autocomplete engine. Given the user's partial prompt, return 3 short, distinct completions that finish their thought. Respond with ONLY a JSON array of 3 strings, no markdown.";
      user = `Partial: "${prompt}"`;
    } else {
      return new Response(JSON.stringify({ error: "invalid mode" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        stream: false,
      }),
    });

    if (!upstream.ok) {
      const t = await upstream.text();
      return new Response(JSON.stringify({ error: `Gateway ${upstream.status}: ${t.slice(0, 200)}` }), {
        status: upstream.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    const content = data?.choices?.[0]?.message?.content?.trim() || "";

    if (mode === "suggest") {
      let suggestions: string[] = [];
      try {
        const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
        suggestions = JSON.parse(cleaned);
        if (!Array.isArray(suggestions)) suggestions = [];
      } catch {
        suggestions = content.split("\n").map((l: string) => l.replace(/^[-*\d.\s"']+/, "").replace(/["']$/, "").trim()).filter(Boolean).slice(0, 3);
      }
      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});