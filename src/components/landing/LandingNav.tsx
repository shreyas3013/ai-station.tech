import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Models', href: '#models' },
  { label: 'Speed', href: '#speed' },
  { label: 'Docs', href: '#docs' },
];

const TrainMark = () => (
  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden>
    <line x1="2" y1="6" x2="26" y2="6" stroke="#3D82C4" strokeWidth="1.6" />
    <line x1="2" y1="14" x2="26" y2="14" stroke="#3D82C4" strokeWidth="1.6" />
    <line x1="6" y1="2" x2="6" y2="18" stroke="#3D82C4" strokeWidth="1.6" />
    <line x1="14" y1="2" x2="14" y2="18" stroke="#3D82C4" strokeWidth="1.6" />
    <line x1="22" y1="2" x2="22" y2="18" stroke="#3D82C4" strokeWidth="1.6" />
  </svg>
);

const LandingNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] h-[68px] flex items-center"
      style={{
        background: scrolled ? 'rgba(4,4,14,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--c-border)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="w-full flex items-center justify-between" style={{ padding: '0 clamp(24px, 5vw, 72px)' }}>
        <Link to="/" className="flex items-center gap-3">
          <TrainMark />
          <span className="font-syne font-bold text-[15px] tracking-[0.2em]" style={{ color: 'var(--c-text)' }}>
            AI STATION
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-outfit text-[13px] tracking-[0.06em] uppercase relative group"
              style={{ color: 'var(--c-text-2)' }}
            >
              <span className="transition-colors duration-200 group-hover:text-[var(--c-signal)]">{l.label}</span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                style={{ background: 'var(--c-signal)' }}
              />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="font-outfit text-[13px] px-5 py-2 rounded-md border transition-all duration-200"
            style={{
              borderColor: 'var(--c-border)',
              color: 'var(--c-text-2)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--c-signal)';
              e.currentTarget.style.color = 'var(--c-signal)';
              e.currentTarget.style.background = 'var(--c-signal-4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--c-border)';
              e.currentTarget.style.color = 'var(--c-text-2)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Sign In
          </Link>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/login"
              className="font-outfit font-medium text-[13px] px-[22px] py-[9px] rounded-md inline-block transition-all duration-200"
              style={{ background: 'var(--c-signal)', color: '#fff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.15)';
                e.currentTarget.style.boxShadow = '0 8px 24px var(--c-signal-3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          style={{ color: 'var(--c-text)' }}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-[68px] left-0 right-0 flex flex-col"
          style={{ background: 'var(--c-deep)', borderBottom: '1px solid var(--c-border)' }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-6 h-12 flex items-center font-outfit text-sm uppercase tracking-wider"
              style={{ color: 'var(--c-text-2)', borderBottom: '1px solid var(--c-border-2)' }}
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="px-6 h-12 flex items-center font-outfit text-sm uppercase tracking-wider"
            style={{ color: 'var(--c-signal)' }}
          >
            Get Started →
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default LandingNav;