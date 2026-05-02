import React from 'react';

const ThinkingDots: React.FC<{ label?: string }> = ({ label = 'Thinking' }) => (
  <div className="flex items-center gap-2 text-muted-foreground text-sm">
    <span>{label}</span>
    <span className="flex gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-thinking-bounce" style={{ animationDelay: '0s' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-thinking-bounce" style={{ animationDelay: '0.15s' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-thinking-bounce" style={{ animationDelay: '0.3s' }} />
    </span>
  </div>
);

export default ThinkingDots;
