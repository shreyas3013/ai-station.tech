const baseHeaders = () => {
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return {
    Authorization: `Bearer ${key}`,
    apikey: key,
    'Content-Type': 'application/json',
  };
};

const url = () => `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-enhance`;

export async function enhancePrompt(prompt: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(url(), {
    method: 'POST', headers: baseHeaders(),
    body: JSON.stringify({ mode: 'enhance', prompt }), signal,
  });
  if (!res.ok) throw new Error(`Enhance failed (${res.status})`);
  const data = await res.json();
  return (data.result || prompt).trim();
}

export async function suggestCompletions(prompt: string, signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(url(), {
    method: 'POST', headers: baseHeaders(),
    body: JSON.stringify({ mode: 'suggest', prompt }), signal,
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.suggestions) ? data.suggestions.slice(0, 3) : [];
}