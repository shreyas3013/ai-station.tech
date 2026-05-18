import { streamViaEdge } from './streamGroq';

export async function streamGemini(
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  return streamViaEdge('gemini', 'gemini-2.0-flash', messages, onChunk, onDone, signal);
}
