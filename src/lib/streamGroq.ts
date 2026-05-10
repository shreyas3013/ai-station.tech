const getGatewayHeaders = () => {
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
  if (data === '[DONE]') {
    onDone();
    return true;
  }

  try {
    const json = JSON.parse(data);
    const token = json.choices?.[0]?.delta?.content ?? '';
    if (token) onChunk(token);
  } catch {
    // Ignore non-JSON heartbeat/chunk lines.
  }

  return false;
};

export async function streamGroq(
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  // Groq slot -> fastest available gateway model
  return streamFromGateway('google/gemini-2.5-flash-lite', messages, onChunk, onDone, signal);
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
    headers: getGatewayHeaders(),
    body: JSON.stringify({ model, messages }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gateway error ${res.status}: ${text.slice(0, 200)}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error || 'Gateway returned JSON instead of a stream');
  }

  if (!res.body) {
    throw new Error('Gateway response had no body');
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
      if (processSseLine(raw.trim(), onChunk, onDone)) return;
    }
  }

  const finalLine = buffer.trim();
  if (finalLine && processSseLine(finalLine, onChunk, onDone)) {
    return;
  }

  onDone();
}