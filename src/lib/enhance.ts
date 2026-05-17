// Prompt enhancer + autocomplete via Supabase Edge Function (keys stay server-side).
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-enhance`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function call(mode: 'enhance' | 'suggest', prompt: string, signal?: AbortSignal) {
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ANON}`,
      apikey: ANON,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mode, prompt }),
    signal,
  });
  if (!res.ok) throw new Error(`ai-enhance ${res.status}`);
  return res.json();
}

export async function enhancePrompt(prompt: string, signal?: AbortSignal): Promise<string> {
  const data = await call('enhance', prompt, signal);
  return (data?.result as string) || prompt;
}

export async function suggestCompletions(prompt: string, signal?: AbortSignal): Promise<string[]> {
  try {
    const data = await call('suggest', prompt, signal);
    return Array.isArray(data?.suggestions) ? data.suggestions.slice(0, 3) : [];
  } catch {
    return [];
  }
}
