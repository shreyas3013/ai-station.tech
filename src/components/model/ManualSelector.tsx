import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ChevronLeft, ChevronRight, X, TrainFront } from 'lucide-react';

const MODELS = [
  { id: 'gemini',                 label: 'Gemini 1.5 Flash', desc: 'Writing / Creative', color: '#3B82F6', emoji: '✨', track: '04A' },
  { id: 'groq',                   label: 'Groq LLaMA 3.3',   desc: 'Fast / News',        color: '#22C55E', emoji: '⚡', track: '01B' },
  { id: 'openrouter-coding',      label: 'Llama 3.1 70B',    desc: 'Coding',             color: '#F59E0B', emoji: '💻', track: '02A' },
  { id: 'openrouter-coder-pro',   label: 'Qwen 2.5 Coder',   desc: 'Advanced Code',      color: '#F97316', emoji: '🔧', track: '02B' },
  { id: 'openrouter-reasoning',   label: 'DeepSeek R1',      desc: 'Reasoning',          color: '#8B5CF6', emoji: '🧠', track: '03A' },
  { id: 'openrouter-phi',         label: 'Phi-4',            desc: 'Quick Facts',        color: '#10B981', emoji: '❓', track: '05C' },
  { id: 'pollinations',           label: 'Pollinations AI',  desc: 'Images',             color: '#EC4899', emoji: '🎨', track: '07A' },
];

const ManualSelector: React.FC = () => {
  const { manualModel, setManualModel } = useChatStore();
  const trackRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
  };

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="metal-panel border-b border-station-border relative overflow-hidden">
      {/* Departure board top strip */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-black/40 border-b border-station-border/60">
        <div className="flex items-center gap-2">
          <span className="led-dot text-station-gold" />
          <span className="flipboard text-[11px] text-station-gold">
            ▎ DEPARTURES — SELECT YOUR TRAIN
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-station text-station-cyan tracking-widest">
            {manualModel ? '◉ MANUAL OVERRIDE' : '◯ AUTO DISPATCH'}
          </span>
          {manualModel && (
            <button
              onClick={() => setManualModel(null)}
              className="p-0.5 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/40 transition-colors"
              title="Clear selection"
            >
              <X size={11} />
            </button>
          )}
          <span className="flipboard text-[11px] text-station-gold tabular-nums">{time}</span>
        </div>
      </div>

      {/* Rail track + train carriages */}
      <div className="relative px-2 py-3">
        {/* Side scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-station-surface/80 border border-station-border text-station-cyan hover:bg-station-cyan/10 hover-lift"
          aria-label="Scroll left"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-station-surface/80 border border-station-border text-station-cyan hover:bg-station-cyan/10 hover-lift"
          aria-label="Scroll right"
        >
          <ChevronRight size={14} />
        </button>

        {/* Rails (under the carriages) */}
        <div className="absolute left-0 right-0 bottom-2 h-px bg-station-border" />
        <div className="absolute left-0 right-0 bottom-3 h-1 rail-ties opacity-70" />

        {/* Carriages */}
        <div
          ref={trackRef}
          className="flex items-end gap-2 overflow-x-auto scrollbar-thin pl-8 pr-8 pb-3"
        >
          {MODELS.map((m, idx) => {
            const active = manualModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setManualModel(active ? null : m.id)}
                title={`${m.label} — ${m.desc}`}
                className={`group relative shrink-0 flex flex-col items-stretch w-[180px] rounded-md border text-left transition-all duration-300 animate-train-arrive ${
                  active
                    ? 'border-current shadow-[0_0_20px_-2px_currentColor]'
                    : 'border-station-border hover:border-station-cyan/50'
                }`}
                style={{
                  color: active ? m.color : undefined,
                  animationDelay: `${idx * 60}ms`,
                }}
              >
                {/* Steam puffs (active only) */}
                {active && (
                  <div className="absolute -top-3 left-3 pointer-events-none">
                    <span className="block w-2 h-2 rounded-full bg-foreground/30 animate-steam" style={{ animationDelay: '0s' }} />
                    <span className="block w-2 h-2 rounded-full bg-foreground/30 animate-steam" style={{ animationDelay: '0.7s' }} />
                    <span className="block w-2 h-2 rounded-full bg-foreground/30 animate-steam" style={{ animationDelay: '1.4s' }} />
                  </div>
                )}

                {/* Carriage roof */}
                <div
                  className="h-1.5 rounded-t-md"
                  style={{ background: `linear-gradient(180deg, ${m.color}, ${m.color}88)` }}
                />

                {/* Carriage body */}
                <div className="bg-station-surface/80 px-2.5 py-2">
                  {/* Track number ribbon */}
                  <div className="flex items-center justify-between text-[9px] font-station tracking-widest text-muted-foreground mb-1">
                    <span>TRK {m.track}</span>
                    <span className="flex items-center gap-1">
                      <span
                        className="led-dot"
                        style={{ color: active ? m.color : 'hsl(var(--muted-foreground))' }}
                      />
                      {active ? 'BOARDING' : 'STANDBY'}
                    </span>
                  </div>

                  {/* Windows row */}
                  <div className="flex gap-1 mb-1.5">
                    {[0, 1, 2, 3].map((w) => (
                      <div
                        key={w}
                        className="flex-1 h-3 rounded-sm border border-station-border/80"
                        style={{
                          background: active
                            ? `${m.color}30`
                            : 'hsl(var(--station-dark))',
                          boxShadow: active ? `inset 0 0 4px ${m.color}aa` : undefined,
                        }}
                      />
                    ))}
                  </div>

                  {/* Label */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{m.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[11px] font-bold font-station tracking-wide truncate"
                        style={{ color: active ? m.color : 'hsl(var(--foreground))' }}
                      >
                        {m.label}
                      </div>
                      <div className="text-[9px] text-muted-foreground truncate">{m.desc}</div>
                    </div>
                  </div>
                </div>

                {/* Wheels */}
                <div className="flex items-center justify-between px-3 -mb-1.5 relative z-10">
                  <span className="block w-2.5 h-2.5 rounded-full bg-station-dark border border-station-border" />
                  <span className="block w-2.5 h-2.5 rounded-full bg-station-dark border border-station-border" />
                  <span className="block w-2.5 h-2.5 rounded-full bg-station-dark border border-station-border" />
                </div>
              </button>
            );
          })}

          {/* Locomotive at the end (decorative) */}
          <div className="shrink-0 flex flex-col items-center justify-end pb-3 pl-1 text-station-gold opacity-70">
            <TrainFront size={24} />
            <span className="text-[8px] font-station tracking-widest mt-0.5">ENGINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualSelector;