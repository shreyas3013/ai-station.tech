// Streams chat completions through the ai-chat Supabase Edge Function.
// API keys live server-side; the browser never sees them.
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function streamViaEdge(
  provider: 'groq' | 'gemini' | 'openrouter',
  model: string,
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ANON}`,
      apikey: ANON,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ provider, model, messages }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.body) throw new Error('No response body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const handleLine = (raw: string): boolean => {
    const line = raw.trim();
    if (!line.startsWith('data:')) return false;
    const data = line.slice(5).trim();
    if (data === '[DONE]') { onDone(); return true; }
    try {
      const json = JSON.parse(data);
      const token = json.choices?.[0]?.delta?.content ?? '';
      if (token) onChunk(token);
    } catch { /* ignore */ }
    return false;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const l of lines) if (handleLine(l)) return;
  }
  if (buffer && handleLine(buffer)) return;
  onDone();
}

export async function streamGroq(
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  return streamViaEdge('groq', 'llama-3.3-70b-versatile', messages, onChunk, onDone, signal);
}
