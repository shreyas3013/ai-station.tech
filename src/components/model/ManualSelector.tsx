import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { X } from 'lucide-react';

const MODELS = [
  { id: 'gemini',               label: 'Gemini 1.5 Flash',     desc: 'Writing / Creative', color: '#3B82F6' },
  { id: 'groq',                 label: 'Groq LLaMA 3.3 70B',   desc: 'Fast / News',        color: '#22C55E' },
  { id: 'openrouter-coding',    label: 'Llama 3.1 70B',        desc: 'Coding',             color: '#F59E0B' },
  { id: 'openrouter-coder-pro', label: 'Qwen 2.5 Coder 32B',   desc: 'Advanced Code',      color: '#F97316' },
  { id: 'openrouter-reasoning', label: 'DeepSeek R1',          desc: 'Reasoning',          color: '#8B5CF6' },
  { id: 'openrouter-phi',       label: 'Phi-4',                desc: 'Quick Facts',        color: '#10B981' },
  { id: 'pollinations',         label: 'Pollinations AI',      desc: 'Images',             color: '#EC4899' },
];

const ManualSelector: React.FC = () => {
  const { manualModel, setManualModel } = useChatStore();

  return (
    <div className="border-b border-border bg-card/50 px-4 py-2 flex items-center gap-3 flex-wrap">
      <span className="text-xs font-medium text-muted-foreground">
        {manualModel ? 'Manual:' : 'Auto-routing'}
      </span>
      <select
        value={manualModel || ''}
        onChange={(e) => setManualModel(e.target.value || null)}
        className="text-xs px-2 py-1 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">Auto (smart router)</option>
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>{m.label} — {m.desc}</option>
        ))}
      </select>
      {manualModel && (
        <button
          onClick={() => setManualModel(null)}
          title="Clear selection"
          className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default ManualSelector;
