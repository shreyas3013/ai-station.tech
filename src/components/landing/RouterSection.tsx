import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const demos = [
  { text: 'Write a short story about Mars...', intent: 'WRITING INTENT DETECTED', target: 'Gemini', color: '#3D82C4', chip: 'gemini' },
  { text: "What's happening in AI news today?", intent: 'NEWS INTENT DETECTED', target: 'Groq', color: '#D4920A', chip: 'groq' },
  { text: 'Debug this TypeScript error...', intent: 'CODING INTENT DETECTED', target: 'OpenRouter', color: '#7C3AED', chip: 'openrouter' },
  { text: 'Generate an image of a neon city at dusk', intent: 'IMAGE INTENT DETECTED', target: 'Pollinations', color: '#BE185D', chip: 'pollinations' },
];

const chips = [
  { name: 'Gemini', color: '#3D82C4', id: 'gemini' },
  { name: 'Groq', color: '#D4920A', id: 'groq' },
  { name: 'OpenRouter', color: '#7C3AED', id: 'openrouter' },
  { name: 'Pollinations', color: '#BE185D', id: 'pollinations' },
];

const RouterSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [demoIdx, setDemoIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    let timer: any;

    const run = async (idx: number) => {
      if (cancelled) return;
      setDemoIdx(idx);
      setTyped('');
      setShowResult(false);
      const d = demos[idx];
      for (let i = 1; i <= d.text.length; i++) {
        if (cancelled) return;
        setTyped(d.text.slice(0, i));
        await new Promise((r) => (timer = setTimeout(r, 38)));
      }
      await new Promise((r) => (timer = setTimeout(r, 500)));
      if (cancelled) return;
      setShowResult(true);
      await new Promise((r) => (timer = setTimeout(r, 2600)));
      if (cancelled) return;
      setShowResult(false);
      await new Promise((r) => (timer = setTimeout(r, 200)));
      run((idx + 1) % demos.length);
    };
    run(0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [inView]);

  const current = demos[demoIdx];

  return (
    <section
      ref={ref}
      id="router"
      style={{
        background: 'linear-gradient(180deg, var(--c-void), var(--c-deep))',
        padding: 'clamp(72px, 12vw, 160px) clamp(24px, 5vw, 72px)',
      }}
    >
      <div className="max-w-[1240px] mx-auto grid gap-12 lg:gap-16" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="grid lg:grid-cols-12 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 lg:sticky lg:top-[120px] self-start"
          >
            <span className="font-mono text-[11px]" style={{ color: 'var(--c-signal)' }}>// 02 — INTELLIGENT ROUTER</span>
            <h2
              className="font-syne font-bold mt-4 mb-6"
              style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 0.94, letterSpacing: '-0.015em', color: 'var(--c-text)' }}
            >
              Your prompt.<br />The perfect<br />
              <span style={{ color: 'var(--c-signal)' }}>model.</span>
            </h2>
            <p className="font-outfit font-light mb-6" style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--c-text-2)' }}>
              AI Station reads intent before routing. No manual switching. The right model activates automatically — every single time.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {['4 Specialists', '< 300ms', '0 Config'].map((c) => (
                <span
                  key={c}
                  className="font-mono text-[11px]"
                  style={{
                    background: 'var(--c-raised)',
                    border: '1px solid var(--c-border-2)',
                    padding: '7px 14px',
                    borderRadius: 4,
                    color: 'var(--c-text-2)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: 'rgba(7,7,26,0.8)',
                backdropFilter: 'blur(24px)',
                border: '1px solid var(--c-border)',
                borderRadius: 16,
                padding: 28,
              }}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, var(--c-signal), transparent)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: 'var(--c-text-3)' }}>
                // INCOMING PROMPT
              </span>
              <div className="mt-3.5 flex items-center min-h-[32px]">
                <span className="font-outfit font-light" style={{ fontSize: 16, color: 'var(--c-text)' }}>
                  {typed}
                </span>
                <motion.span
                  className="inline-block ml-1"
                  style={{ width: 2, height: 18, background: 'var(--c-signal)' }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.85, repeat: Infinity }}
                />
              </div>

              {showResult && (
                <>
                  <div className="my-3.5 h-px" style={{ background: 'var(--c-border)' }} />
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <span className="font-mono text-[11px]" style={{ color: 'var(--c-signal)' }}>
                      {current.intent}
                    </span>
                    <span
                      className="font-mono text-[11px]"
                      style={{
                        background: `${current.color}26`,
                        border: `1px solid ${current.color}66`,
                        color: current.color,
                        padding: '4px 12px',
                        borderRadius: 4,
                      }}
                    >
                      → {current.target}
                    </span>
                  </motion.div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3 mt-5">
                {chips.map((c) => {
                  const active = showResult && current.chip === c.id;
                  return (
                    <motion.div
                      key={c.id}
                      animate={
                        active
                          ? { y: -3, scale: 1.02, borderColor: c.color, backgroundColor: `${c.color}14` }
                          : { y: 0, scale: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'var(--c-raised)' as any }
                      }
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2"
                      style={{
                        border: '1px solid var(--c-border-2)',
                        borderRadius: 10,
                        padding: '12px 14px',
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          background: c.color,
                          boxShadow: active ? `0 0 8px ${c.color}` : 'none',
                        }}
                      />
                      <span
                        className="font-mono text-[12px]"
                        style={{ color: active ? 'var(--c-text)' : 'var(--c-text-2)' }}
                      >
                        {c.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RouterSection;