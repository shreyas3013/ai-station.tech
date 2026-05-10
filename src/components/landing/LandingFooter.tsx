import React from 'react';
import { Link } from 'react-router-dom';

const TrainMark = () => (
  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden>
    <line x1="2" y1="6" x2="26" y2="6" stroke="#3D82C4" strokeWidth="1.6" />
    <line x1="2" y1="14" x2="26" y2="14" stroke="#3D82C4" strokeWidth="1.6" />
    <line x1="6" y1="2" x2="6" y2="18" stroke="#3D82C4" strokeWidth="1.6" />
    <line x1="14" y1="2" x2="14" y2="18" stroke="#3D82C4" strokeWidth="1.6" />
    <line x1="22" y1="2" x2="22" y2="18" stroke="#3D82C4" strokeWidth="1.6" />
  </svg>
);

const LandingFooter: React.FC = () => {
  return (
    <footer
      style={{
        background: '#020208',
        borderTop: '1px solid var(--c-border-2)',
        padding: '60px clamp(24px,5vw,72px) 40px',
      }}
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-3">
            <TrainMark />
            <span className="font-syne font-bold text-[15px] tracking-[0.2em]" style={{ color: 'var(--c-text)' }}>
              AI STATION
            </span>
          </Link>
          <div className="flex flex-wrap gap-6 font-outfit text-[13px]" style={{ color: 'var(--c-text-3)' }}>
            <Link to="/login" className="transition-colors duration-150 hover:text-[var(--c-text-2)]">Get Started</Link>
            <Link to="/chat" className="transition-colors duration-150 hover:text-[var(--c-text-2)]">Open App</Link>
            <Link to="/code-station" className="transition-colors duration-150 hover:text-[var(--c-text-2)]">Code Station</Link>
          </div>
          <span className="font-mono text-[11px]" style={{ color: 'var(--c-text-3)' }}>
            Gemini · Groq · OpenRouter · Pollinations
          </span>
        </div>
        <div
          className="mt-10 pt-6 text-center font-mono text-[10px]"
          style={{ borderTop: '1px solid var(--c-border-2)', color: 'var(--c-text-3)', letterSpacing: '0.06em' }}
        >
          © 2025 AI STATION · Final Year Project · AGCE Satara · DBATU Lonere
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;