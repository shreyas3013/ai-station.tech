// Prompt enhancer + autocomplete via Groq (fast, free tier).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method === "GET") {
    return json({ status: "ok", function: "ai-enhance", hasKey: !!Deno.env.get("GROQ_API_KEY") });
  }
  try {
    const { mode, prompt } = await req.json();
    const key = Deno.env.get("GROQ_API_KEY");
    if (!key) return json({ error: "GROQ_API_KEY not configured" }, 500);

    let system = "", user = "";
    if (mode === "enhance") {
      system = "You are a prompt engineer. Rewrite the user's prompt to be clearer, more specific, and more effective for an AI assistant. Keep the original intent. Respond with ONLY the rewritten prompt — no preamble, no quotes, no explanation.";
      user = prompt;
    } else if (mode === "suggest") {
      system = "You are an autocomplete engine. Given the user's partial prompt, return 3 short, distinct completions that finish their thought. Respond with ONLY a JSON array of 3 strings, no markdown.";
      user = `Partial: "${prompt}"`;
    } else {
      return json({ error: "invalid mode" }, 400);
    }

    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        stream: false,
        temperature: 0.7,
      }),
    });
    if (!upstream.ok) {
      const t = await upstream.text();
      return json({ error: `Groq ${upstream.status}: ${t.slice(0, 200)}` }, upstream.status);
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
        suggestions = content.split("\n")
          .map((l: string) => l.replace(/^[-*\d.\s"']+/, "").replace(/["']$/, "").trim())
          .filter(Boolean).slice(0, 3);
      }
      return json({ suggestions });
    }
    return json({ result: content });
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
