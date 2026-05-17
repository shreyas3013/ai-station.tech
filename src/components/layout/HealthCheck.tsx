import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props { collapsed?: boolean }

const HealthCheck: React.FC<Props> = ({ collapsed }) => {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
    fetch(url, { method: 'OPTIONS' })
      .then((r) => setOk(r.ok || r.status === 204 || r.status === 200))
      .catch(() => setOk(false));
  }, []);
  const allOk = ok === true;

  if (collapsed) {
    return (
      <div className="flex justify-center py-2" title={allOk ? 'AI proxy online' : 'AI proxy unreachable'}>
        {allOk ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-destructive" />}
      </div>
    );
  }

  return (
    <div className="px-3 py-2 border-t border-border text-xs">
      <div className="font-station uppercase tracking-wider text-[10px] text-muted-foreground mb-1.5">
        Backend Proxy
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-foreground/80">
          {allOk ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-destructive" />}
          <span className="font-mono">ai-chat</span>
        </span>
        <span className="text-muted-foreground text-[10px]">
          {ok === null ? 'Checking…' : allOk ? 'Online' : 'Offline'}
        </span>
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">
        Keys stored server-side as Supabase secrets.
      </div>
    </div>
  );
};

export default HealthCheck;
