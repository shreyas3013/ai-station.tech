import { streamViaEdge } from './streamGroq';

export async function streamOpenRouter(
  messages: { role: string; content: string }[],
  model: string,
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  return streamViaEdge('openrouter', model, messages, onChunk, onDone, signal);
}
