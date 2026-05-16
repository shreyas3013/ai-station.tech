// Prompt enhancer + autocomplete using Gemini directly.
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

async function callGemini(system: string, user: string, signal?: AbortSignal): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY missing');
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-1.5-flash',
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
    signal,
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content || '').trim();
}

export async function enhancePrompt(prompt: string, signal?: AbortSignal): Promise<string> {
  const result = await callGemini(
    "You are a prompt engineer. Rewrite the user's prompt to be clearer, more specific, and more effective for an AI assistant. Keep the original intent. Respond with ONLY the rewritten prompt — no preamble, no quotes, no explanation.",
    prompt, signal
  );
  return result || prompt;
}

export async function suggestCompletions(prompt: string, signal?: AbortSignal): Promise<string[]> {
  try {
    const content = await callGemini(
      "You are an autocomplete engine. Given the user's partial prompt, return 3 short distinct completions that finish their thought. Respond with ONLY a JSON array of 3 strings, no markdown.",
      `Partial: "${prompt}"`, signal
    );
    const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch {
    return [];
  }
}
