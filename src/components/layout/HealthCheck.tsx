import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const providers = [
  { name: 'Gemini', env: 'VITE_GEMINI_API_KEY' },
  { name: 'Groq', env: 'VITE_GROQ_API_KEY' },
  { name: 'OpenRouter', env: 'VITE_OPENROUTER_API_KEY' },
  { name: 'Deepgram', env: 'VITE_DEEPGRAM_API_KEY' },
];

interface Props { collapsed?: boolean }

const HealthCheck: React.FC<Props> = ({ collapsed }) => {
  const states = providers.map((p) => ({
    ...p,
    ok: !!(import.meta.env as Record<string, string | undefined>)[p.env],
  }));
  const allOk = states.every((s) => s.ok);

  if (collapsed) {
    return (
      <div className="flex justify-center py-2" title={allOk ? 'All API keys present' : 'Missing API keys'}>
        {allOk ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-destructive" />}
      </div>
    );
  }

  return (
    <div className="px-3 py-2 border-t border-border text-xs">
      <div className="font-station uppercase tracking-wider text-[10px] text-muted-foreground mb-1.5">
        API Providers
      </div>
      <ul className="space-y-1">
        {states.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-foreground/80">
              {s.ok ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-destructive" />}
              <span className="font-mono">{s.name}</span>
            </span>
            <span className="text-muted-foreground text-[10px]">{s.ok ? 'Ready' : 'No key'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthCheck;
