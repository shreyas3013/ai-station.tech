export async function streamGroq(
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  return streamFromGateway('google/gemini-2.5-flash', messages, onChunk, onDone, signal);
}

export async function streamFromGateway(
  model: string,
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages }),
    signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gateway error ${res.status}: ${text.slice(0, 200)}`);
  }

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
      const line = raw.trim();
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') { onDone(); return; }
      try {
        const json = JSON.parse(data);
        const token = json.choices?.[0]?.delta?.content ?? '';
        if (token) onChunk(token);
      } catch { /* ignore */ }
    }
  }
  onDone();
}