import React from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

const cards = [
  { value: 241, suffix: '', unit: 't/s', label: 'Token Throughput', source: 'ArtificialAnalysis.ai, 2024', color: '#D4920A' },
  { value: 0.3, suffix: '', unit: 'sec', label: 'Time to First Token', source: 'Groq Benchmark, 2024', color: '#3D82C4', decimals: 1 },
  { value: 10, suffix: 'x', unit: '', label: 'Faster than GPU', source: 'Groq LPU Whitepaper', color: '#7C3AED' },
  { value: 0, suffix: '', unit: '', label: 'Cold Start Delay', source: 'Deterministic execution', color: '#BE185D' },
];

const Counter: React.FC<{ to: number; decimals?: number; suffix?: string; visible: boolean; color: string }> = ({ to, decimals = 0, suffix = '', visible, color }) => {
  const v = useMotionValue(0);
  const spring = useSpring(v, { stiffness: 40, damping: 14 });
  const display = useTransform(spring, (x) => `${x.toFixed(decimals)}${suffix}`);
  React.useEffect(() => {
    if (visible) v.set(to);
  }, [visible, to, v]);
  return <motion.span className="font-syne font-extrabold" style={{ fontSize: 52, color }}>{display}</motion.span>;
};

const SpeedSection: React.FC = () => {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const headlineWords = ['Groq', 'runs', 'at', '241', 'tokens/second.'];

  return (
    <section
      ref={ref}
      id="speed"
      style={{ background: 'var(--c-void)', padding: 'clamp(72px,12vw,160px) clamp(24px,5vw,72px)' }}
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-[640px] mx-auto">
          <span className="font-mono text-[11px]" style={{ color: 'var(--c-signal)' }}>// 04 — SPEED</span>
          <h2
            className="font-syne font-bold mt-4"
            style={{
              fontSize: 'clamp(36px,5.5vw,72px)',
              lineHeight: 0.94,
              letterSpacing: '-0.015em',
              color: 'var(--c-text)',
            }}
          >
            {headlineWords.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.04 }}
                className="inline-block mr-3"
                style={
                  /^\d/.test(w)
                    ? { color: 'var(--c-gold-2)', textShadow: '0 0 30px rgba(245,158,11,0.5)' }
                    : {}
                }
              >
                {w}
              </motion.span>
            ))}
          </h2>
        </div>

        <div className="mt-20 grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden"
              style={{
                background: 'var(--c-surface)',
                border: '1px solid var(--c-border)',
                borderRadius: 16,
                padding: '32px 28px',
              }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${c.color}, transparent 70%)`,
                  filter: 'blur(24px)',
                  opacity: 0.2,
                }}
              />
              <div className="flex items-baseline">
                <Counter to={c.value} decimals={c.decimals || 0} suffix={c.suffix} visible={inView} color={c.color} />
                {c.unit && (
                  <span className="font-syne font-bold ml-1" style={{ fontSize: 24, color: 'var(--c-text-2)' }}>
                    {c.unit}
                  </span>
                )}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] mt-2" style={{ color: 'var(--c-text-3)' }}>
                {c.label}
              </div>
              <div className="font-outfit font-light italic mt-1" style={{ fontSize: 13, color: 'var(--c-text-3)' }}>
                {c.source}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 max-w-[700px] mx-auto space-y-5">
          {[
            { label: 'Groq LPU', pct: 100, value: '241 t/s', color: 'var(--c-gold-2)' },
            { label: 'GPU (H100)', pct: 35, value: '~85 t/s', color: 'var(--c-text-3)' },
          ].map((b, i) => (
            <div key={b.label}>
              <div className="flex justify-between font-mono text-[12px] mb-2" style={{ color: 'var(--c-text-2)' }}>
                <span>{b.label}</span>
                <span>{b.value}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-raised)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${b.pct}%` } : {}}
                  transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 + i * 0.2 }}
                  className="h-full"
                  style={{ background: b.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeedSection;