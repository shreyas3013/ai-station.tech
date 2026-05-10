import React from 'react';
import { motion } from 'framer-motion';

const Node: React.FC<{ name: string; status: 'active' | 'standby'; color: string; idx: number }> = ({ name, status, color, idx }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: idx * 0.2 }}
    className="flex flex-col items-center gap-2"
  >
    <div
      className="flex items-center justify-center font-mono text-[11px]"
      style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: `2px ${status === 'active' ? 'solid' : 'dashed'} ${status === 'active' ? color : color + '66'}`,
        background: `${color}10`,
        color: 'var(--c-text)',
      }}
    >
      {name}
    </div>
    <div className="flex items-center gap-1.5">
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: status === 'active' ? '#22C55E' : '#F59E0B' }}
        animate={status === 'active' ? { opacity: [1, 0.4, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="font-mono text-[10px]" style={{ color: 'var(--c-text-3)' }}>
        {status === 'active' ? 'Active' : 'Standby'}
      </span>
    </div>
  </motion.div>
);

const Connector: React.FC = () => (
  <div className="flex flex-col items-center gap-1 my-1">
    <span className="font-mono text-[10px]" style={{ color: 'var(--c-text-3)' }}>Fails →</span>
    <svg width="20" height="40" viewBox="0 0 20 40">
      <motion.line
        x1="10" y1="0" x2="10" y2="32"
        stroke="rgba(74,144,217,0.4)" strokeWidth="1.5" strokeDasharray="4 4"
        animate={{ strokeDashoffset: [0, -16] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <polyline points="6,28 10,34 14,28" fill="none" stroke="rgba(74,144,217,0.6)" strokeWidth="1.5" />
    </svg>
  </div>
);

const FallbackSection: React.FC = () => {
  return (
    <section
      style={{
        background: 'var(--c-deep)',
        padding: 'clamp(72px,11vw,140px) clamp(24px,5vw,72px)',
      }}
    >
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-5 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-2"
        >
          <span className="font-mono text-[11px]" style={{ color: 'var(--c-signal)' }}>// 05 — RESILIENCE</span>
          <h2
            className="font-syne font-bold mt-4 mb-5"
            style={{
              fontSize: 'clamp(26px,3.5vw,48px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: 'var(--c-text)',
            }}
          >
            Built to never<br />go offline.
          </h2>
          <p className="font-outfit font-light" style={{ fontSize: 17, color: 'var(--c-text-2)', lineHeight: 1.75 }}>
            If a model hits rate limits or fails, AI Station silently re-routes to the next available option. You never see an error.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-3 flex flex-col items-center"
        >
          <Node name="Groq" status="active" color="#3D82C4" idx={0} />
          <Connector />
          <Node name="OpenRouter" status="standby" color="#7C3AED" idx={1} />
          <Connector />
          <Node name="Gemini" status="standby" color="#D4920A" idx={2} />
        </motion.div>
      </div>
    </section>
  );
};

export default FallbackSection;