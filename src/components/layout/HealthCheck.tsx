import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';

type Status = 'checking' | 'ok' | 'down' | 'no-key';

interface FnState {
  status: Status;
  latency?: number;
  message?: string;
}

const FUNCTIONS = ['ai-chat', 'ai-image'] as const;
type FnName = typeof FUNCTIONS[number];

async function pingFunction(name: FnName): Promise<FnState> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${name}`;
  const start = performance.now();
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    });
    const latency = Math.round(performance.now() - start);
    if (!res.ok) {
      return { status: 'down', latency, message: `HTTP ${res.status}` };
    }
    const data = await res.json().catch(() => ({}));
    if (data?.hasKey === false) {
      return { status: 'no-key', latency, message: 'LOVABLE_API_KEY missing' };
    }
    return { status: 'ok', latency };
  } catch (err) {
    return { status: 'down', message: err instanceof Error ? err.message : 'Network error' };
  }
}

const statusIcon = (s: Status) => {
  switch (s) {
    case 'checking': return <Loader2 size={12} className="animate-spin text-muted-foreground" />;
    case 'ok': return <CheckCircle2 size={12} className="text-green-500" />;
    case 'no-key': return <AlertTriangle size={12} className="text-amber-500" />;
    case 'down': return <XCircle size={12} className="text-destructive" />;
  }
};

const statusLabel = (s: Status) => {
  switch (s) {
    case 'checking': return 'Checking…';
    case 'ok': return 'Online';
    case 'no-key': return 'No key';
    case 'down': return 'Offline';
  }
};

interface Props {
  collapsed?: boolean;
}

const HealthCheck: React.FC<Props> = ({ collapsed }) => {
  const [states, setStates] = useState<Record<FnName, FnState>>({
    'ai-chat': { status: 'checking' },
    'ai-image': { status: 'checking' },
  });
  const [refreshing, setRefreshing] = useState(false);

  const runChecks = useCallback(async () => {
    setRefreshing(true);
    setStates({
      'ai-chat': { status: 'checking' },
      'ai-image': { status: 'checking' },
    });
    const results = await Promise.all(FUNCTIONS.map(async (n) => [n, await pingFunction(n)] as const));
    const next = {} as Record<FnName, FnState>;
    for (const [n, s] of results) next[n] = s;
    setStates(next);
    setRefreshing(false);
  }, []);

  useEffect(() => { runChecks(); }, [runChecks]);

  const overall: Status = Object.values(states).every(s => s.status === 'ok')
    ? 'ok'
    : Object.values(states).some(s => s.status === 'checking')
    ? 'checking'
    : Object.values(states).some(s => s.status === 'down')
    ? 'down'
    : 'no-key';

  if (collapsed) {
    return (
      <div className="flex justify-center py-2" title={`Edge functions: ${statusLabel(overall)}`}>
        {statusIcon(overall)}
      </div>
    );
  }

  return (
    <div className="px-3 py-2 border-t border-border text-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-station uppercase tracking-wider text-[10px] text-muted-foreground">
          Edge Functions
        </span>
        <button
          onClick={runChecks}
          disabled={refreshing}
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          title="Re-check"
        >
          <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>
      <ul className="space-y-1">
        {FUNCTIONS.map((name) => {
          const s = states[name];
          return (
            <li
              key={name}
              className="flex items-center justify-between gap-2"
              title={s.message || statusLabel(s.status)}
            >
              <span className="flex items-center gap-1.5 text-foreground/80">
                {statusIcon(s.status)}
                <span className="font-mono">{name}</span>
              </span>
              <span className="text-muted-foreground text-[10px]">
                {s.status === 'ok' && s.latency ? `${s.latency}ms` : statusLabel(s.status)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HealthCheck;