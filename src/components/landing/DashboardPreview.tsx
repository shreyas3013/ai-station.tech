import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Copy, Volume2, ThumbsUp } from 'lucide-react';

const DashboardPreview: React.FC = () => {
  return (
    <section
      style={{ background: 'var(--c-deep)', padding: 'clamp(72px,12vw,160px) clamp(24px,5vw,72px)' }}
    >
      <div className="text-center max-w-[640px] mx-auto">
        <span className="font-mono text-[11px]" style={{ color: 'var(--c-signal)' }}>// 07 — THE PLATFORM</span>
        <h2
          className="font-syne font-bold mt-4"
          style={{
            fontSize: 'clamp(36px,5.5vw,72px)',
            lineHeight: 0.94,
            letterSpacing: '-0.015em',
            color: 'var(--c-text)',
          }}
        >
          The platform.<br />
          <span style={{ color: 'var(--c-signal)' }}>Ready for you.</span>
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.15 }}
        className="relative max-w-[980px] mx-auto mt-20 overflow-hidden"
        style={{
          background: 'rgba(6,6,18,0.95)',
          border: '1px solid rgba(74,144,217,0.25)',
          borderRadius: 24,
          boxShadow: '0 0 0 1px rgba(74,144,217,0.15), 0 40px 80px rgba(0,0,0,0.7), 0 0 120px rgba(74,144,217,0.06)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(74,144,217,0.6), transparent)' }}
        />

        {/* Browser chrome */}
        <div
          className="h-11 flex items-center px-4 gap-2"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex gap-2">
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div
            className="mx-auto font-mono text-[11px] text-center"
            style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--c-text-3)', width: 240, padding: '4px 10px', borderRadius: 6 }}
          >
            final-station.lovable.app
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[220px_1fr] min-h-[460px]">
          {/* Sidebar */}
          <div className="p-4 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--c-border-2)' }}>
            <div className="font-syne font-bold text-[12px] tracking-[0.2em]" style={{ color: 'var(--c-text)' }}>
              AI STATION
            </div>
            <button
              className="font-mono text-[11px] py-2 rounded-md mt-2"
              style={{ background: 'var(--c-signal)', color: '#fff' }}
            >
              + NEW CHAT
            </button>
            <button
              className="font-mono text-[11px] py-2 rounded-md"
              style={{ background: 'transparent', border: '1px solid var(--c-border-2)', color: 'var(--c-text-2)' }}
            >
              👻 TEMP CHAT
            </button>
            <div className="mt-4 space-y-2">
              {['Mars story draft', 'AI Act news', 'Debug TS error'].map((t) => (
                <div
                  key={t}
                  className="px-3 py-2 rounded font-outfit text-[12px]"
                  style={{ background: 'var(--c-raised)', color: 'var(--c-text-2)', borderLeft: '2px solid var(--c-signal)' }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex flex-col">
            <div className="px-5 py-3 flex items-center gap-2 border-b" style={{ borderColor: 'var(--c-border-2)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
              <span className="font-mono text-[11px] tracking-[0.15em]" style={{ color: 'var(--c-text-2)' }}>
                GROQ · AUTO MODE
              </span>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-hidden">
              <div className="flex justify-end">
                <div
                  className="max-w-[75%] font-outfit text-[13px] px-4 py-2.5"
                  style={{ background: 'var(--c-signal)', color: '#fff', borderRadius: '14px 14px 4px 14px' }}
                >
                  What's the latest in AI today?
                </div>
              </div>

              <div>
                <div
                  className="max-w-[85%] font-outfit text-[13px] px-4 py-3"
                  style={{
                    background: 'var(--c-surface)',
                    color: 'var(--c-text)',
                    borderLeft: '3px solid var(--c-signal)',
                    borderRadius: '4px 14px 14px 14px',
                    lineHeight: 1.7,
                  }}
                >
                  Routing to Groq for fast news. The biggest story today is the EU AI Act enforcement deadline beginning in February...
                </div>
                <div className="flex gap-3 mt-2 ml-1" style={{ color: 'var(--c-text-3)' }}>
                  <Copy size={12} />
                  <Volume2 size={12} />
                  <ThumbsUp size={12} />
                </div>
              </div>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px" style={{ background: 'var(--c-border-2)' }} />
                <span className="font-mono text-[10px]" style={{ color: 'var(--c-gold-2)' }}>↕ Switched to Gemini</span>
                <div className="flex-1 h-px" style={{ background: 'var(--c-border-2)' }} />
              </div>

              <div>
                <div
                  className="max-w-[85%] font-outfit text-[13px] px-4 py-3"
                  style={{
                    background: 'var(--c-surface)',
                    color: 'var(--c-text)',
                    borderLeft: '3px solid var(--c-gold-2)',
                    borderRadius: '4px 14px 14px 14px',
                    lineHeight: 1.7,
                  }}
                >
                  Continuing in Gemini for richer analysis: this regulation will reshape how foundation models are deployed across European markets...
                </div>
              </div>
            </div>

            <div
              className="m-4 p-3 flex items-center gap-3 rounded-xl"
              style={{
                background: 'var(--c-glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--c-border)',
              }}
            >
              <Mic size={16} style={{ color: 'var(--c-text-3)' }} />
              <span className="flex-1 font-outfit text-[13px]" style={{ color: 'var(--c-text-3)' }}>
                Ask anything...
              </span>
              <span
                className="font-mono text-[10px] px-2 py-1 rounded"
                style={{ background: 'var(--c-signal-4)', color: 'var(--c-signal)' }}
              >
                AUTO
              </span>
              <button
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ background: 'var(--c-signal)', color: '#fff' }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden p-6 text-center font-outfit text-sm" style={{ color: 'var(--c-text-2)' }}>
          The full dashboard preview is best viewed on a larger screen.
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardPreview;