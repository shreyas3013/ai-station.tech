import { streamProvider } from './streamGroq';

export async function streamOpenRouter(
  messages: { role: string; content: string }[],
  model: string,
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  return streamProvider('openrouter', model, messages, onChunk, onDone, signal);
}
