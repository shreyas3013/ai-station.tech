import React from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '4', label: 'MODELS' },
  { value: '< 0.3s', label: 'AVG RESPONSE' },
  { value: '∞', label: 'CONTEXT MEMORY' },
  { value: '0', label: 'MANUAL SWITCHING' },
  { value: '1', label: 'PLATFORM' },
];

const SocialProofBar: React.FC = () => {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      style={{
        background: 'var(--c-surface)',
        borderTop: '1px solid var(--c-border)',
        borderBottom: '1px solid var(--c-border)',
        padding: '32px clamp(24px,5vw,72px)',
      }}
    >
      <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-6">
        <span className="font-mono text-[11px]" style={{ color: 'var(--c-text-3)' }}>
          Trusted architecture powering
        </span>
        <div className="flex flex-wrap items-center gap-8">
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(255,255,255,0.06)' }} />}
              <div className="flex flex-col">
                <span className="font-syne font-bold text-[32px]" style={{ color: 'var(--c-signal)' }}>{s.value}</span>
                <span className="font-mono text-[10px] tracking-[0.15em]" style={{ color: 'var(--c-text-3)' }}>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default SocialProofBar;