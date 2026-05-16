import { streamOpenAICompat } from './streamGroq';

export async function streamOpenRouter(
  messages: { role: string; content: string }[],
  model: string,
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!key) throw new Error('VITE_OPENROUTER_API_KEY missing');
  return streamOpenAICompat(
    'https://openrouter.ai/api/v1/chat/completions',
    key,
    model,
    messages, onChunk, onDone, signal,
    {
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://final-station.lovable.app',
      'X-Title': 'AI Station',
    }
  );
}
