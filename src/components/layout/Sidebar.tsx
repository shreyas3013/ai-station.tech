import React, { useEffect, useState, useCallback } from 'react';
import { MessageSquarePlus, Zap, LogOut, Code, ChevronLeft, ChevronRight, Trash2, Star } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import HealthCheck from './HealthCheck';

interface Session {
  id: string;
  title: string;
  starred: boolean;
  updated_at: string;
}

const Sidebar: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { sessionId, setSessionId, clearMessages, setTempMode, isTempMode } = useChatStore();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('chats')
      .select('id, title, starred, updated_at')
      .eq('user_id', user.id)
      .order('starred', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(50);
    if (data) setSessions(data);
  }, [user]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleNewChat = () => {
    clearMessages();
    setTempMode(false);
    navigate('/');
  };

  const handleTempChat = () => {
    clearMessages();
    setTempMode(true);
    navigate('/');
  };

  const handleSelectSession = async (session: Session) => {
    setTempMode(false);
    setSessionId(session.id);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', session.id)
      .order('created_at', { ascending: true });
    if (data) {
      useChatStore.setState({
        messages: data.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          modelUsed: m.model_used || '',
          modelLabel: (m.routing_info as any)?.label || '',
          modelColor: '#666',
          isImage: m.is_image,
          imageUrl: m.image_url,
          timestamp: new Date(m.created_at),
        })),
      });
    }
    navigate('/');
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await supabase.from('chats').delete().eq('id', id);
    if (sessionId === id) clearMessages();
    fetchSessions();
  };

  const handleSignOut = async () => {
    await signOut();
    clearMessages();
    navigate('/login');
  };

  if (collapsed) {
    return (
      <div className="w-14 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-4">
        <button onClick={() => setCollapsed(false)} className="p-2 text-sidebar-foreground hover:text-foreground">
          <ChevronRight size={18} />
        </button>
        <button onClick={handleNewChat} className="p-2 text-sidebar-foreground hover:text-foreground"><MessageSquarePlus size={18} /></button>
        <button onClick={handleTempChat} className="p-2 text-station-gold hover:text-foreground"><Zap size={18} /></button>
        <button onClick={() => navigate('/code-station')} className="p-2 text-sidebar-foreground hover:text-foreground"><Code size={18} /></button>
        <div className="flex-1" />
        <HealthCheck collapsed />
        <button onClick={handleSignOut} className="p-2 text-sidebar-foreground hover:text-destructive"><LogOut size={18} /></button>
      </div>
    );
  }

  return (
    <div className="w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <h2 className="text-lg font-heading font-bold text-foreground">🚉 AI STATION</h2>
        <button onClick={() => setCollapsed(true)} className="p-1 text-sidebar-foreground hover:text-foreground">
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="p-3 space-y-2">
        <button onClick={handleNewChat} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <MessageSquarePlus size={16} /> New Chat
        </button>
        <button onClick={handleTempChat} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${isTempMode ? 'border-station-gold bg-station-gold/10 text-station-gold' : 'border-border text-muted-foreground hover:text-foreground'}`}>
          <Zap size={16} /> Temp Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 scrollbar-thin">
        {sessions.map((s) => (
          <div
            key={s.id}
            role="button"
            tabIndex={0}
            onClick={() => handleSelectSession(s)}
            onKeyDown={(e) => e.key === 'Enter' && handleSelectSession(s)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left mb-1 group transition-colors cursor-pointer ${
              sessionId === s.id ? 'bg-sidebar-accent text-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            {s.starred && <Star size={12} className="text-station-gold shrink-0" />}
            <span className="truncate flex-1">{s.title}</span>
            <button
              onClick={(e) => handleDelete(e, s.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-sidebar-border p-3 space-y-2">
        <button
          onClick={() => navigate('/code-station')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            location.pathname === '/code-station' ? 'bg-sidebar-accent text-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
          }`}
        >
          <Code size={16} /> Code Station
          <span className="ml-auto px-1.5 py-0.5 text-[10px] font-station rounded bg-station-gold/20 text-station-gold">BETA</span>
        </button>

        <HealthCheck />

        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="truncate flex-1 text-xs">{user?.email}</span>
          <button onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;