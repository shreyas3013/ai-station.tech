import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Wand2, Link2, Ghost, Terminal, History, type LucideIcon } from 'lucide-react';

const cardBase = {
  background: 'var(--c-glass)',
  backdropFilter: 'blur(20px)',
  border: '1px solid var(--c-border-2)',
  borderRadius: 20,
  padding: 32,
};

const Wave = () => (
  <div className="flex items-end gap-1 h-16 mt-6">
    {[0.4, 0.7, 0.9, 0.5, 0.8, 0.6, 0.45].map((h, i) => (
      <motion.div
        key={i}
        className="w-1.5 rounded-full"
        style={{ background: 'var(--c-signal)', height: `${h * 100}%` }}
        animate={{ scaleY: [0.5, 1, 0.5] }}
        transition={{ duration: 1 + i * 0.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }}
      />
    ))}
  </div>
);

const CodePreview = () => (
  <pre
    className="font-mono text-[11px] mt-5 p-3 rounded-md overflow-hidden"
    style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--c-text-2)', lineHeight: 1.6 }}
  >
    <span style={{ color: '#7C3AED' }}>def</span>{' '}
    <span style={{ color: '#3D82C4' }}>greet</span>(name):{'\n'}
    {'  '}
    <span style={{ color: '#D4920A' }}>print</span>(<span style={{ color: '#22C55E' }}>"Hi "</span> + name)
  </pre>
);

type Card = {
  icon: LucideIcon;
  title: string;
  desc: string;
  badge?: string;
  decoration?: React.ReactNode;
  span: string;
};

const cards: Card[] = [
  { icon: Mic, title: 'Voice Native', desc: "Speak your prompts. Hear responses. Zero API cost — powered entirely by the browser's Speech API.", decoration: <Wave />, span: 'lg:col-span-8 lg:row-span-2' },
  { icon: Wand2, title: 'Smart Autocomplete', desc: 'Groq-powered completions appear as you type. Press → to accept.', span: 'lg:col-span-4' },
  { icon: Link2, title: 'Share Anything', desc: 'One click generates a permanent read-only link to any conversation.', span: 'lg:col-span-4' },
  { icon: Ghost, title: 'Temp Mode', desc: 'Ghost mode. Nothing saves. Disappears when you close the tab.', span: 'lg:col-span-4' },
  { icon: Terminal, title: 'Code Station', desc: 'Practice Python, JavaScript, Java, and more. AI simulates real output. No installs needed.', badge: 'BETA', decoration: <CodePreview />, span: 'lg:col-span-4 lg:row-span-2' },
  { icon: History, title: 'Persistent History', desc: 'Every conversation saved. Resume any session. Auto-titled for quick scanning.', span: 'lg:col-span-8' },
];

const FeatureGrid: React.FC = () => {
  return (
    <section
      id="platform"
      style={{ background: 'var(--c-void)', padding: 'clamp(72px,11vw,140px) clamp(24px,5vw,72px)' }}
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-[520px] mx-auto mb-16">
          <span className="font-mono text-[11px]" style={{ color: 'var(--c-signal)' }}>// 06 — PLATFORM</span>
          <h2
            className="font-syne font-bold mt-4"
            style={{
              fontSize: 'clamp(36px,5.5vw,72px)',
              lineHeight: 0.94,
              letterSpacing: '-0.015em',
              color: 'var(--c-text)',
            }}
          >
            Everything. One platform.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 auto-rows-[minmax(180px,auto)]">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: 'spring', stiffness: 100, damping: 18, delay: i * 0.06 }}
                whileHover={{ y: -4, borderColor: 'rgba(74,144,217,0.3)' as any }}
                style={{ ...cardBase, position: 'relative', overflow: 'hidden' }}
                className={`${c.span} flex flex-col`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={24} color="#3D82C4" />
                  {c.badge && (
                    <span
                      className="font-mono text-[9px] tracking-[0.15em]"
                      style={{
                        background: 'rgba(212,146,10,0.15)',
                        border: '1px solid rgba(212,146,10,0.3)',
                        color: '#D4920A',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {c.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-outfit font-medium mt-4 mb-2" style={{ fontSize: 19, color: 'var(--c-text)' }}>
                  {c.title}
                </h3>
                <p className="font-outfit font-light" style={{ fontSize: 14, color: 'var(--c-text-2)', lineHeight: 1.65 }}>
                  {c.desc}
                </p>
                {c.decoration}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;