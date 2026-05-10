import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const TrackCanvas = lazy(() => import('./TrackCanvas'));

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as any } },
};

const HeroSection: React.FC = () => {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.06]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentBlur = useTransform(scrollYProgress, [0, 0.4], ['blur(0px)', 'blur(16px)']);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)');
    const onChange = () => setIsDesktop(m.matches);
    onChange();
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: '100vh',
        paddingTop: 68,
        background: isDesktop
          ? 'var(--c-void)'
          : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(61,130,196,0.12), transparent 70%), var(--c-void)',
      }}
    >
      {isDesktop && (
        <Suspense fallback={null}>
          <TrackCanvas />
        </Suspense>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center mx-auto"
        style={{
          maxWidth: 900,
          padding: '0 clamp(24px, 5vw, 72px)',
          scale: contentScale,
          opacity: contentOpacity,
          filter: contentBlur,
        }}
      >
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 px-4 py-[7px] rounded-full mb-9"
          style={{ background: 'var(--c-signal-5)', border: '1px solid var(--c-signal-4)' }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#22C55E' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            className="font-mono text-[11px] tracking-[0.2em]"
            style={{ color: 'var(--c-text-3)' }}
          >
            LIVE — 4 MODELS ACTIVE
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-syne font-extrabold mb-7"
          style={{
            fontSize: 'clamp(52px, 9vw, 116px)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            color: 'var(--c-text)',
          }}
        >
          <span className="block">EVERY AI</span>
          <span
            className="block"
            style={{ color: 'var(--c-signal)', textShadow: '0 0 100px rgba(74,144,217,0.35)' }}
          >
            MODEL.
          </span>
          <span className="block" style={{ fontSize: '0.72em' }}>ONE STATION.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="font-outfit font-light mb-2.5"
          style={{ fontSize: 'clamp(17px, 1.8vw, 21px)', color: 'var(--c-text-2)' }}
        >
          Smart routing. Shared memory. Zero switching.
        </motion.p>

        <motion.p
          variants={item}
          className="font-mono mb-[52px]"
          style={{
            fontSize: 12,
            letterSpacing: '0.08em',
            color: 'rgba(154,170,187,0.5)',
          }}
        >
          Gemini · Groq · OpenRouter · Pollinations
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Link
              to="/login"
              className="font-syne font-bold inline-block relative overflow-hidden"
              style={{
                background: 'var(--c-signal)',
                color: '#fff',
                fontSize: 14,
                letterSpacing: '0.08em',
                padding: '15px 44px',
                borderRadius: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(74,144,217,0.5), 0 12px 40px rgba(74,144,217,0.35)';
              }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              BOARD THE STATION
            </Link>
          </motion.div>
          <motion.a
            href="#models"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="font-syne font-bold inline-block transition-colors duration-200"
            style={{
              background: 'transparent',
              border: '1px solid rgba(74,144,217,0.25)',
              color: 'var(--c-text-2)',
              fontSize: 14,
              letterSpacing: '0.08em',
              padding: '15px 44px',
              borderRadius: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(74,144,217,0.6)';
              e.currentTarget.style.color = 'var(--c-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(74,144,217,0.25)';
              e.currentTarget.style.color = 'var(--c-text-2)';
            }}
          >
            EXPLORE MODELS
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ bottom: 40, opacity: indicatorOpacity }}
      >
        <div className="flex gap-2">
          {[0, 0.35].map((d, i) => (
            <div key={i} className="relative w-[1.5px] h-12 overflow-hidden" style={{ background: 'rgba(74,144,217,0.2)' }}>
              <motion.div
                className="absolute left-0 right-0"
                style={{ height: '40%', background: 'var(--c-signal)' }}
                initial={{ y: '-100%' }}
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: d }}
              />
            </div>
          ))}
        </div>
        <span className="font-mono text-[9px]" style={{ color: 'var(--c-text-3)', letterSpacing: '0.2em' }}>SCROLL</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;