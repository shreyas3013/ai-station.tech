// Generic OpenAI-compatible SSE streaming helper + direct Groq call.
export async function streamOpenAICompat(
  endpoint: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal,
  extraHeaders: Record<string, string> = {}
): Promise<void> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify({ model, messages, stream: true }),
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

  const handleLine = (raw: string) => {
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
    for (const l of lines) {
      if (handleLine(l)) return;
    }
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
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error('VITE_GROQ_API_KEY missing');
  return streamOpenAICompat(
    'https://api.groq.com/openai/v1/chat/completions',
    key,
    'llama-3.3-70b-versatile',
    messages, onChunk, onDone, signal
  );
}
