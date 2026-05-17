import { streamViaEdge } from './streamGroq';

export async function streamGemini(
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  return streamViaEdge('gemini', 'gemini-1.5-flash', messages, onChunk, onDone, signal);
}
