const getHeaders = () => {
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return {
    Authorization: `Bearer ${key}`,
    apikey: key,
    'Content-Type': 'application/json',
    Accept: 'text/event-stream, application/json',
  };
};

const processSseLine = (line: string, onChunk: (token: string) => void, onDone: () => void) => {
  if (!line.startsWith('data:')) return false;
  const data = line.slice(5).trim();
  if (data === '[DONE]') { onDone(); return true; }
  try {
    const j = JSON.parse(data);
    const token = j.choices?.[0]?.delta?.content ?? '';
    if (token) onChunk(token);
  } catch { /* heartbeat */ }
  return false;
};

export async function streamProvider(
  provider: 'groq' | 'openrouter' | 'gemini',
  model: string | undefined,
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ provider, model, messages }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let msg = text.slice(0, 300);
    try { msg = JSON.parse(text).error || msg; } catch {}
    throw new Error(`${provider} error ${res.status}: ${msg}`);
  }

  const ctype = res.headers.get('content-type') || '';
  if (ctype.includes('application/json')) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error || `${provider} returned JSON instead of stream`);
  }
  if (!res.body) throw new Error(`${provider} response had no body`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const raw of lines) {
      if (processSseLine(raw.trim(), onChunk, onDone)) return;
    }
  }
  const last = buffer.trim();
  if (last && processSseLine(last, onChunk, onDone)) return;
  onDone();
}

// Back-compat wrappers
export const streamGroq = (
  msgs: { role: string; content: string }[],
  onChunk: (t: string) => void, onDone: () => void, signal?: AbortSignal
) => streamProvider('groq', 'llama-3.3-70b-versatile', msgs, onChunk, onDone, signal);

export const streamFromGateway = streamProvider;
