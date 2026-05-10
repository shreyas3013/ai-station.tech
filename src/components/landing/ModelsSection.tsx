import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Code2, Image as ImageIcon, ArrowUpRight } from 'lucide-react';

const models = [
  {
    icon: Sparkles,
    provider: 'Google · Gemini 1.5 Flash',
    name: 'Gemini',
    badge: 'Creative Writing',
    desc: 'The poet of the fleet. Essays, stories, long-form writing — when language is the output, Gemini leads.',
    router: 'writing, essays, creative, stories',
    color: '#3D82C4',
    grad: 'linear-gradient(90deg,#3D82C4,#00C9FF)',
    n: '01',
  },
  {
    icon: Zap,
    provider: 'Groq · Llama 3 8B',
    name: 'Groq',
    badge: 'Speed & News',
    desc: '241 tokens per second. Sub-300ms responses. When speed is the answer, there is no debate.',
    router: 'news, current events, fast Q&A, general',
    color: '#D4920A',
    grad: 'linear-gradient(90deg,#D4920A,#FF6B00)',
    n: '02',
  },
  {
    icon: Code2,
    provider: 'OpenRouter · Llama 3.1',
    name: 'OpenRouter',
    badge: 'Code & Reasoning',
    desc: 'Logic-first model. Debugging, algorithms, system design, and technical reasoning without compromise.',
    router: 'code, debug, algorithm, technical',
    color: '#7C3AED',
    grad: 'linear-gradient(90deg,#7C3AED,#A855F7)',
    n: '03',
  },
  {
    icon: ImageIcon,
    provider: 'Pollinations · Free Tier',
    name: 'Pollinations',
    badge: 'Image Generation',
    desc: 'Zero cost. No key. Describe anything. Receive it as an image. Visual creativity on demand.',
    router: 'image, draw, generate, visualize',
    color: '#BE185D',
    grad: 'linear-gradient(90deg,#BE185D,#F43F5E)',
    n: '04',
  },
];

const ModelsSection: React.FC = () => {
  return (
    <section
      id="models"
      style={{
        background: 'var(--c-void)',
        padding: 'clamp(72px, 12vw, 160px) clamp(24px, 5vw, 72px)',
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 640, marginBottom: 80 }}
      >
        <span className="font-mono text-[11px]" style={{ color: 'var(--c-signal)' }}>
          // 01 — THE FLEET
        </span>
        <h2
          className="font-syne font-bold mt-4 mb-5"
          style={{
            fontSize: 'clamp(36px, 5.5vw, 72px)',
            lineHeight: 0.94,
            letterSpacing: '-0.015em',
            color: 'var(--c-text)',
          }}
        >
          The right model,<br />
          <span style={{ color: 'var(--c-signal)' }}>every time.</span>
        </h2>
        <p className="font-outfit font-light" style={{ fontSize: 18, color: 'var(--c-text-2)', lineHeight: 1.75 }}>
          A purpose-built routing layer reads the intent of every prompt and dispatches it to the model that is fastest, sharpest, or most creative for the job.
        </p>
      </motion.header>

      <motion.div
        className="grid gap-5 max-w-[1240px] mx-auto"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        {models.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.name}
              variants={{
                hidden: { opacity: 0, y: 60, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } },
              }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="relative overflow-hidden cursor-pointer flex flex-col"
              style={{
                background: 'var(--c-glass)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${m.color}33`,
                borderRadius: 20,
                padding: '36px 32px',
                minHeight: 380,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${m.color}99`;
                e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${m.color}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${m.color}33`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: m.grad, borderRadius: '20px 20px 0 0' }}
              />
              <div
                className="absolute pointer-events-none font-syne font-extrabold"
                style={{
                  fontSize: 160,
                  color: m.color,
                  opacity: 0.05,
                  right: -12,
                  bottom: -24,
                  lineHeight: 1,
                }}
              >
                {m.n}
              </div>

              <div
                className="flex items-center justify-center mb-5"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `${m.color}1A`,
                  border: `1px solid ${m.color}40`,
                }}
              >
                <Icon size={24} color={m.color} />
              </div>

              <span className="font-mono text-[10px] tracking-[0.18em] uppercase mb-1.5" style={{ color: 'var(--c-text-3)' }}>
                {m.provider}
              </span>
              <h3 className="font-syne font-bold mb-2.5" style={{ fontSize: 32, color: 'var(--c-text)' }}>{m.name}</h3>
              <span
                className="inline-block self-start font-mono text-[10px] tracking-[0.06em] mb-4"
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  background: `${m.color}1A`,
                  border: `1px solid ${m.color}40`,
                  color: m.color,
                }}
              >
                {m.badge}
              </span>
              <p className="font-outfit font-light mb-5" style={{ fontSize: 15, color: 'var(--c-text-2)', lineHeight: 1.7 }}>
                {m.desc}
              </p>
              <div className="flex items-center gap-1.5 font-mono text-[10px] mb-5" style={{ color: 'var(--c-gold-2)' }}>
                <ArrowUpRight size={12} />
                AUTO → {m.router}
              </div>

              <div
                className="mt-auto pt-5 flex items-center gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#22C55E' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="font-mono text-[11px]" style={{ color: 'var(--c-text-3)' }}>Online</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default ModelsSection;