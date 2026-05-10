import { streamFromGateway } from './streamGroq';

export async function streamGemini(
  messages: { role: string; content: string }[],
  onChunk: (token: string) => void,
  onDone: () => void
): Promise<void> {
  return streamFromGateway('google/gemini-2.5-flash', messages, onChunk, onDone);
}