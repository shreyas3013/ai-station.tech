import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const FinalCTA: React.FC = () => {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'var(--c-void)',
        padding: 'clamp(96px,14vw,180px) clamp(24px,5vw,72px) clamp(72px,11vw,140px)',
      }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ y: bgY }}
      >
        <span
          className="font-syne font-extrabold whitespace-nowrap"
          style={{
            fontSize: 'clamp(80px,15vw,220px)',
            color: 'var(--c-signal)',
            opacity: 0.025,
            letterSpacing: '0.06em',
          }}
        >
          ALL ABOARD
        </span>
      </motion.div>

      <div className="relative z-10 text-center max-w-[800px] mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[11px]"
          style={{ color: 'var(--c-signal)', letterSpacing: '0.28em' }}
        >
          // FINAL DEPARTURE
        </motion.span>

        <h2
          className="font-syne font-extrabold mt-5"
          style={{
            fontSize: 'clamp(52px,9vw,116px)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            color: 'var(--c-text)',
          }}
        >
          {['Your AI journey', 'starts now.'].map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="block"
              style={
                i === 1
                  ? { color: 'var(--c-signal)', textShadow: '0 0 80px rgba(74,144,217,0.45)' }
                  : {}
              }
            >
              {line}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-outfit font-light mt-5"
          style={{ fontSize: 19, color: 'var(--c-text-2)' }}
        >
          One platform. Every model. Zero complexity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-14 inline-block"
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            to="/login"
            className="font-syne font-bold inline-block relative overflow-hidden"
            style={{
              background: 'var(--c-signal)',
              color: '#fff',
              fontSize: 16,
              letterSpacing: '0.14em',
              padding: '20px 76px',
              borderRadius: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(74,144,217,0.6), 0 20px 60px rgba(74,144,217,0.4), 0 40px 80px rgba(0,0,0,0.5)';
            }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
          >
            BOARD THE STATION →
          </Link>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-mono text-[11px]" style={{ color: 'rgba(154,170,187,0.45)' }}>
          {[
            { name: 'Gemini', color: '#3D82C4' },
            { name: 'Groq', color: '#D4920A' },
            { name: 'OpenRouter', color: '#7C3AED' },
            { name: 'Pollinations', color: '#BE185D' },
          ].map((m, i) => (
            <span key={m.name} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full" style={{ background: m.color }} />
              {m.name}
              {i < 3 && <span className="ml-3 opacity-50">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;