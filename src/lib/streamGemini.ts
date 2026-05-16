import { streamOpenAICompat } from './streamGroq';

export async function streamGemini(
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY missing');
  return streamOpenAICompat(
    'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    key,
    'gemini-1.5-flash',
    messages, onChunk, onDone, signal
  );
}
