export type ModelId =
  | 'gemini'
  | 'groq'
  | 'openrouter-reasoning'
  | 'openrouter-coding'
  | 'openrouter-coder-pro'
  | 'openrouter-phi'
  | 'pollinations';

export interface RouterDecision {
  modelId: ModelId;
  label: string;
  openrouterModel?: string;
  reason: string;
  color: string;
}

const ADVANCED_CODE_KEYWORDS = [
  'architecture', 'design pattern', 'refactor', 'optimize', 'review my code',
  'review this code', 'code review', 'best practices', 'solid principles',
  'microservices', 'database schema', 'system design', 'deploy', 'docker',
  'kubernetes', 'ci/cd', 'performance issue', 'memory leak'
];

const BASIC_CODE_KEYWORDS = [
  'code', 'debug', 'function', 'algorithm', 'typescript', 'javascript',
  'python', 'java', 'react', 'html', 'css', 'api', 'sql', 'error',
  'fix', 'bug', 'implement', 'class', 'loop', 'array', 'component',
  'async', 'promise', 'fetch', 'hook', 'useState', 'useEffect'
];

const REASONING_KEYWORDS = [
  'analyze', 'compare', 'evaluate', 'pros and cons', 'should i', 'which is better',
  'math', 'calculate', 'solve', 'proof', 'logic', 'reasoning', 'step by step',
  'explain why', 'how does', 'difference between', 'research', 'thesis',
  'hypothesis', 'methodology', 'statistics'
];

const WRITING_KEYWORDS = [
  'write', 'essay', 'poem', 'story', 'blog', 'article', 'draft',
  'email', 'letter', 'summarize', 'translate', 'paraphrase', 'describe',
  'caption', 'creative', 'script', 'explain in detail', 'rewrite',
  'improve my writing', 'proofread', 'grammar'
];

const IMAGE_KEYWORDS = [
  'image', 'picture', 'photo', 'generate image', 'draw', 'illustration',
  'create an image', 'visualize', 'artwork', 'portrait', 'landscape',
  'scene', 'render', 'digital art', 'anime', 'realistic photo', 'show me'
];

const QUICK_KEYWORDS = [
  'what is', 'define', 'meaning of', 'who is', 'when was', 'where is',
  'quick', 'brief', 'tldr', 'in short', 'one line', 'simple question'
];

const NEWS_KEYWORDS = [
  'news', 'latest', 'current', 'today', 'trending', 'breaking',
  'headline', 'update', 'recent', 'happening', 'event', 'politics',
  'sports score', 'weather', 'stock', 'election'
];

export function routePrompt(prompt: string): RouterDecision {
  const lower = prompt.toLowerCase().trim();
  const score = (keywords: string[]) =>
    keywords.filter(k => lower.includes(k)).length;

  const imageScore = score(IMAGE_KEYWORDS);
  const advCodeScore = score(ADVANCED_CODE_KEYWORDS);
  const codeScore = score(BASIC_CODE_KEYWORDS);
  const reasonScore = score(REASONING_KEYWORDS);
  const writeScore = score(WRITING_KEYWORDS);
  const quickScore = score(QUICK_KEYWORDS);
  const newsScore = score(NEWS_KEYWORDS);

  if (imageScore >= 1) return {
    modelId: 'pollinations', label: 'Pollinations AI',
    reason: 'Image generation request detected', color: '#EC4899'
  };

  if (advCodeScore >= 1 || (codeScore >= 2 && prompt.length > 200)) return {
    modelId: 'openrouter-coder-pro',
    openrouterModel: 'qwen/qwen-2.5-coder-32b-instruct',
    label: 'Qwen 2.5 Coder 32B',
    reason: 'Complex coding / architecture task', color: '#F97316'
  };

  if (codeScore >= 1) return {
    modelId: 'openrouter-coding',
    openrouterModel: 'meta-llama/llama-3.3-70b-instruct',
    label: 'Llama 3.3 70B (Code)',
    reason: 'Coding task — Llama 3.3 70B via OpenRouter', color: '#F59E0B'
  };

  if (reasonScore >= 2) return {
    modelId: 'openrouter-reasoning',
    openrouterModel: 'deepseek/deepseek-v4-flash:free',
    label: 'DeepSeek V4 Flash (Reasoning)',
    reason: 'Deep reasoning / analysis task', color: '#8B5CF6'
  };

  if (writeScore >= 2) return {
    modelId: 'gemini', label: 'Gemini 2.0 Flash',
    reason: 'Creative / writing task — Gemini excels here', color: '#3B82F6'
  };

  if (quickScore >= 2) return {
    modelId: 'openrouter-phi',
    openrouterModel: 'microsoft/phi-4',
    label: 'Phi-4 (Quick)',
    reason: 'Quick factual query — Phi-4 is fast', color: '#10B981'
  };

  if (newsScore >= 1) return {
    modelId: 'groq', label: 'Groq LLaMA 3.3 70B',
    reason: 'News / current affairs — Groq for fastest response', color: '#22C55E'
  };

  return {
    modelId: 'groq', label: 'Groq LLaMA 3.3 70B',
    reason: 'General query — Groq for fast response', color: '#22C55E'
  };
}

export function buildManualDecision(modelId: string): RouterDecision {
  const map: Record<string, RouterDecision> = {
    gemini: { modelId: 'gemini', label: 'Gemini 2.0 Flash', reason: 'Manual selection', color: '#3B82F6' },
    groq: { modelId: 'groq', label: 'Groq LLaMA 3.3 70B', reason: 'Manual selection', color: '#22C55E' },
    'openrouter-coding': { modelId: 'openrouter-coding', openrouterModel: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (Code)', reason: 'Manual selection', color: '#F59E0B' },
    'openrouter-coder-pro': { modelId: 'openrouter-coder-pro', openrouterModel: 'qwen/qwen-2.5-coder-32b-instruct', label: 'Qwen 2.5 Coder 32B', reason: 'Manual selection', color: '#F97316' },
    'openrouter-reasoning': { modelId: 'openrouter-reasoning', openrouterModel: 'deepseek/deepseek-v4-flash:free', label: 'DeepSeek V4 Flash (Reasoning)', reason: 'Manual selection', color: '#8B5CF6' },
    'openrouter-phi': { modelId: 'openrouter-phi', openrouterModel: 'microsoft/phi-4', label: 'Phi-4 (Quick)', reason: 'Manual selection', color: '#10B981' },
    pollinations: { modelId: 'pollinations', label: 'Pollinations AI', reason: 'Manual selection', color: '#EC4899' },
  };
  return map[modelId] || map.groq;
}