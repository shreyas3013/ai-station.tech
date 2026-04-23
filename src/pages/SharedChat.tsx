import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import MessageBubble from '@/components/chat/MessageBubble';
import { Message } from '@/store/chatStore';

const SharedChat: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [title, setTitle] = useState('Shared Conversation');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!token) return;
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('id, title')
        .eq('share_token', token)
        .single();

      if (!session) { setLoading(false); return; }
      setTitle(session.title);

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (msgs) {
        setMessages(msgs.map((m: any) => ({
          id: m.id, role: m.role, content: m.content,
          modelUsed: m.model_used || '', modelLabel: m.model_label || '',
          modelColor: '#666', isImage: m.is_image, imageUrl: m.image_url,
          timestamp: new Date(m.created_at),
        })));
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-station">LOADING SHARED CONVERSATION...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground">🚉 AI STATION</h1>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
          <p className="text-xs font-station text-muted-foreground/50 mt-2">SHARED CONVERSATION — READ ONLY</p>
        </div>
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground">No messages found or invalid share link.</p>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
      </div>
    </div>
  );
};

export default SharedChat;