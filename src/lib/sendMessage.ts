import { routePrompt, buildManualDecision, RouterDecision } from './router';
import { streamGroq } from './streamGroq';
import { streamOpenRouter } from './streamOpenRouter';
import { streamGemini } from './streamGemini';
import { generateImage } from './generateImage';

async function callModel(
  decision: RouterDecision,
  messages: { role: string; content: string }[],
  onChunk: (t: string) => void,
  onDone: () => void,
  signal?: AbortSignal
) {
  switch (decision.modelId) {
    case 'groq':
      return streamGroq(messages, onChunk, onDone, signal);
    case 'openrouter-reasoning':
    case 'openrouter-coding':
    case 'openrouter-coder-pro':
    case 'openrouter-phi':
      return streamOpenRouter(messages, decision.openrouterModel!, onChunk, onDone, signal);
    case 'gemini':
      return streamGemini(messages, onChunk, onDone);
  }
}

export async function sendMessage(
  prompt: string,
  history: { role: string; content: string }[],
  manualModel: string | null,
  onChunk: (token: string) => void,
  onDone: (decision: RouterDecision) => void,
  onImage: (url: string, decision: RouterDecision) => void,
  onError: (msg: string) => void,
  signal?: AbortSignal
) {
  const decision = manualModel
    ? buildManualDecision(manualModel)
    : routePrompt(prompt);

  const fullMessages = [...history, { role: 'user', content: prompt }];

  try {
    if (decision.modelId === 'pollinations') {
      const url = await generateImage(prompt);
      onImage(url, decision);
      return;
    }

    await callModel(decision, fullMessages, onChunk, () => onDone(decision), signal);
  } catch (err) {
    const fallbacks: RouterDecision[] = [
      { modelId: 'groq', label: 'Groq LLaMA 3.3 70B', reason: 'Fallback', color: '#22C55E' },
      { modelId: 'openrouter-coding', openrouterModel: 'meta-llama/llama-3.1-70b-instruct:free', label: 'Llama 3.1 70B', reason: 'Fallback', color: '#F59E0B' },
      { modelId: 'gemini', label: 'Gemini 1.5 Flash', reason: 'Fallback', color: '#3B82F6' },
    ];

    for (const fallback of fallbacks) {
      if (fallback.modelId === decision.modelId) continue;
      try {
        await callModel(fallback, fullMessages, onChunk, () => onDone(fallback), signal);
        return;
      } catch { continue; }
    }

    const message = err instanceof Error ? err.message : 'Unknown model error';
    onError(message.includes('aborted') ? 'Request cancelled.' : `All models failed. ${message}`);
  }
}