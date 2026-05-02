import React, { useRef, useEffect, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import MessageBubble from './MessageBubble';
import { Share2, FileDown, Check, Loader2 } from 'lucide-react';
import { shareChat } from '@/lib/shareChat';
import { exportChatToDocx } from '@/lib/exportChat';
import { toast } from 'sonner';

const MessageList: React.FC = () => {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const sessionId = useChatStore((s) => s.sessionId);
  const isTempMode = useChatStore((s) => s.isTempMode);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [exporting, setExporting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-heading font-bold text-foreground tracking-tight mb-2">AI Station</h1>
        <p className="text-muted-foreground text-sm">Unified AI platform — all models, one interface</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8 max-w-xl">
          {[
            'Write me a React component',
            'Analyze the pros and cons',
            'Write a blog article about AI',
            'Generate an image of a sunset',
            'Latest news about technology',
            'What is quantum computing?',
          ].map((s) => (
            <button
              key={s}
              className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (!sessionId || isTempMode) {
      toast.error('Save the chat first (send a message in non-temp mode).');
      return;
    }
    setSharing(true);
    try {
      const url = await shareChat(sessionId);
      await navigator.clipboard.writeText(url);
      setShared(true);
      toast.success('Share link copied to clipboard');
      setTimeout(() => setShared(false), 2500);
    } catch {
      toast.error('Failed to create share link');
    } finally {
      setSharing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportChatToDocx(messages);
      toast.success('Conversation exported');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
        <span className="text-xs text-muted-foreground">
          {messages.length} message{messages.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            disabled={sharing || isTempMode || !sessionId}
            title={isTempMode ? 'Disabled in Temp mode' : 'Share chat link'}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {sharing ? <Loader2 size={12} className="animate-spin" /> : shared ? <Check size={12} /> : <Share2 size={12} />}
            {shared ? 'Copied' : 'Share'}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            title="Export as .docx"
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 transition-colors"
          >
            {exporting ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
            DOCX
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageList;
