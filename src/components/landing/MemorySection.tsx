import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const MemorySection: React.FC = () => {
  return (
    <section
      style={{
        background: 'var(--c-deep)',
        padding: 'clamp(72px,12vw,160px) clamp(24px,5vw,72px)',
      }}
    >
      <div className="max-w-[800px] mx-auto text-center">
        <span className="font-mono text-[11px]" style={{ color: 'var(--c-signal)' }}>// 03 — SHARED MEMORY</span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-syne font-bold mt-4 mb-5"
          style={{ fontSize: 'clamp(36px,5.5vw,72px)', lineHeight: 0.94, letterSpacing: '-0.015em', color: 'var(--c-text)' }}
        >
          Models switch.<br />
          <span style={{ color: 'var(--c-signal)' }}>Memory doesn't.</span>
        </motion.h2>
        <p className="font-outfit font-light mx-auto" style={{ maxWidth: 500, fontSize: 18, color: 'var(--c-text-2)', lineHeight: 1.7 }}>
          Switch between AI models in a single conversation. Context never resets — every model picks up exactly where the last one left off.
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.25 } } }}
          className="mt-20 max-w-[560px] mx-auto flex flex-col"
        >
          {/* Bubble 1 — user */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="ml-auto"
            style={{ maxWidth: '80%' }}
          >
            <div
              className="text-left font-outfit"
              style={{
                background: 'var(--c-raised)',
                border: '1px solid var(--c-border-2)',
                borderRadius: '14px 14px 4px 14px',
                padding: '14px 18px',
                fontSize: 15,
                color: 'var(--c-text)',
              }}
            >
              What's the latest news on the AI Act in Europe?
            </div>
            <div className="flex justify-end mt-2">
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[10px]"
                style={{
                  background: 'rgba(212,146,10,0.1)',
                  border: '1px solid rgba(212,146,10,0.25)',
                  color: '#D4920A',
                  padding: '3px 10px',
                  borderRadius: 20,
                }}
              >
                ↗ Groq · News Mode
              </span>
            </div>
          </motion.div>

          {/* Track divider */}
          <Divider />

          {/* Bubble 2 — user */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="ml-auto"
            style={{ maxWidth: '80%' }}
          >
            <div
              className="text-left font-outfit"
              style={{
                background: 'var(--c-raised)',
                border: '1px solid var(--c-border-2)',
                borderRadius: '14px 14px 4px 14px',
                padding: '14px 18px',
                fontSize: 15,
                color: 'var(--c-text)',
              }}
            >
              Now write me a short story inspired by what you just told me.
            </div>
          </motion.div>

          <Divider />

          {/* Bubble 3 — AI */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            style={{ maxWidth: '88%' }}
          >
            <div
              className="text-left font-outfit"
              style={{
                background: 'var(--c-surface)',
                borderLeft: '3px solid #7C3AED',
                borderTop: '1px solid var(--c-border-2)',
                borderRight: '1px solid var(--c-border-2)',
                borderBottom: '1px solid var(--c-border-2)',
                borderRadius: '4px 14px 14px 14px',
                padding: '16px 18px',
                fontSize: 15,
                color: 'var(--c-text)',
                lineHeight: 1.7,
              }}
            >
              <span
                style={{
                  background: 'rgba(74,144,217,0.14)',
                  color: 'var(--c-signal)',
                  borderRadius: 4,
                  padding: '0 4px',
                }}
              >
                Based on our previous conversation
              </span>{' '}
              about the EU AI Act, here is a short story exploring the world it might create...
            </div>
            <div className="flex justify-start mt-2">
              <span
                className="inline-flex items-center gap-1.5 font-mono text-[10px]"
                style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  color: '#A855F7',
                  padding: '3px 10px',
                  borderRadius: 20,
                }}
              >
                ↗ OpenRouter · Llama 3.1
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 inline-flex items-center gap-2 mx-auto"
            style={{
              padding: '12px 24px',
              borderRadius: 40,
              border: '1px solid rgba(74,144,217,0.3)',
              background: 'rgba(74,144,217,0.07)',
            }}
          >
            <CheckCircle size={16} style={{ color: 'var(--c-signal)' }} />
            <span className="font-mono text-[11px]" style={{ color: 'var(--c-text-2)' }}>
              Context preserved across all model switches
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Divider: React.FC = () => (
  <div className="relative h-12 flex items-center justify-center">
    <div className="relative h-full flex gap-1 items-stretch">
      <div className="w-px" style={{ background: 'rgba(74,144,217,0.2)' }} />
      <div className="w-px" style={{ background: 'rgba(74,144,217,0.2)' }} />
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: 'var(--c-signal)' }}
        animate={{ y: ['0%', '300%'] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
    <span
      className="absolute left-1/2 -translate-x-1/2 -translate-y-[120%] font-mono text-[9px]"
      style={{ color: 'var(--c-text-3)', letterSpacing: '0.2em', top: '-4px' }}
    >
      MODEL SWITCH
    </span>
  </div>
);

export default MemorySection;