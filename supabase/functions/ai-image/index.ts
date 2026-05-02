// Image generation. Uses Pollinations (free, no key) as primary,
// returns the URL. Lovable AI Gateway is no longer used.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method === "GET") return json({ status: "ok", function: "ai-image", provider: "pollinations" });

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") return json({ error: "prompt required" }, 400);
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&seed=${Date.now()}`;
    // Verify reachability (HEAD)
    try {
      const head = await fetch(url, { method: "HEAD" });
      if (!head.ok) return json({ error: `Pollinations ${head.status}` }, 502);
    } catch (e) {
      return json({ error: `Pollinations unreachable: ${e}` }, 502);
    }
    return json({ url });
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
