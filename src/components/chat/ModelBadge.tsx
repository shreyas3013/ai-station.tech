import React from 'react';

interface ModelBadgeProps {
  label: string;
  color: string;
  reason?: string;
}

const ModelBadge: React.FC<ModelBadgeProps> = React.memo(({ label, color, reason }) => (
  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-station bg-secondary" title={reason}>
    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-foreground/80">{label}</span>
  </div>
));

ModelBadge.displayName = 'ModelBadge';
export default ModelBadge;