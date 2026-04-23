import React, { useMemo } from 'react';

const RailwayBackground: React.FC = () => {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 6,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      {/* Animated particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Railway tracks */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-10">
        <div className="absolute bottom-0 left-[48%] w-px h-full bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-[52%] w-px h-full bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-[46%] w-[8%] h-px bg-primary/30"
            style={{ bottom: `${i * 6 + 5}%`, animation: `railTie 3s ease-in-out ${i * 0.2}s infinite alternate` }}
          />
        ))}
      </div>
    </div>
  );
};

export default RailwayBackground;