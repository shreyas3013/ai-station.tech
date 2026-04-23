import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { X } from 'lucide-react';

const MODELS = [
  { id: 'gemini', label: 'Gemini 1.5 Flash', desc: 'Writing / Creative', color: '#3B82F6', emoji: '✨' },
  { id: 'groq', label: 'Groq LLaMA 3.3', desc: 'Fast / News', color: '#22C55E', emoji: '⚡' },
  { id: 'openrouter-coding', label: 'Llama 3.1 70B', desc: 'Coding', color: '#F59E0B', emoji: '💻' },
  { id: 'openrouter-coder-pro', label: 'Qwen 2.5 Coder', desc: 'Advanced Code', color: '#F97316', emoji: '🔧' },
  { id: 'openrouter-reasoning', label: 'DeepSeek R1', desc: 'Reasoning', color: '#8B5CF6', emoji: '🧠' },
  { id: 'openrouter-phi', label: 'Phi-4', desc: 'Quick Facts', color: '#10B981', emoji: '❓' },
  { id: 'pollinations', label: 'Pollinations AI', desc: 'Images', color: '#EC4899', emoji: '🎨' },
];

const ManualSelector: React.FC = () => {
  const { manualModel, setManualModel } = useChatStore();

  return (
    <div className="border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-thin">
        <span className="text-xs font-station text-muted-foreground shrink-0">
          {manualModel ? 'MANUAL' : 'AUTO ROUTING'}
        </span>
        {manualModel && (
          <button onClick={() => setManualModel(null)} className="p-1 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30">
            <X size={12} />
          </button>
        )}
        <div className="h-4 w-px bg-border" />
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => setManualModel(manualModel === m.id ? null : m.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all border ${
              manualModel === m.id
                ? 'border-current bg-current/10'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
            }`}
            style={manualModel === m.id ? { color: m.color } : undefined}
          >
            <span>{m.emoji}</span>
            <span className="font-medium">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManualSelector;