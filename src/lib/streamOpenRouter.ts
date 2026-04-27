import { streamFromGateway } from './streamGroq';

// OpenRouter model IDs are mapped to equivalent Lovable AI Gateway models so the
// existing router/manual-selection logic keeps working without exposing any API
// keys from the browser.
const MODEL_MAP: Record<string, string> = {
  // DeepSeek R1 reasoning -> Gemini 2.5 Pro (deep thinking)
  'deepseek/deepseek-r1:free': 'google/gemini-2.5-pro',
  // Llama 3.1 70B (general code) -> Gemini 2.5 Flash
  'meta-llama/llama-3.1-70b-instruct:free': 'google/gemini-2.5-flash',
  // Qwen Coder (advanced code) -> Gemini 2.5 Pro
  'qwen/qwen-2.5-coder-32b-instruct:free': 'google/gemini-2.5-pro',
  // Phi-4 quick -> Flash Lite
  'microsoft/phi-4:free': 'google/gemini-2.5-flash-lite',
};

export async function streamOpenRouter(
  messages: { role: string; content: string }[],
  model: string,
  onChunk: (token: string) => void,
  onDone: () => void,
  signal?: AbortSignal
): Promise<void> {
  const mapped = MODEL_MAP[model] || 'google/gemini-2.5-flash';
  return streamFromGateway(mapped, messages, onChunk, onDone, signal);
}