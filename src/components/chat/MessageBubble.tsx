import React, { useState, useCallback } from 'react';
import { Copy, Check, Volume2, VolumeX, Download, Cpu } from 'lucide-react';
import { Message } from '@/store/chatStore';
import TypingCursor from './TypingCursor';
import { speakText, stopSpeaking, isSpeaking } from '@/lib/voiceOutput';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message, isStreaming }) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  const handleSpeak = useCallback(() => {
    if (isSpeaking()) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      speakText(message.content);
      setSpeaking(true);
      const check = setInterval(() => {
        if (!isSpeaking()) { setSpeaking(false); clearInterval(check); }
      }, 500);
    }
  }, [message.content]);

  if (message.isImage && message.imageUrl) {
    return (
      <div className="flex justify-start mb-4 animate-slide-up">
        <div className="max-w-lg">
          <ModelHeader label={message.modelLabel} color={message.modelColor} />
          <div className="mt-2 rounded-lg overflow-hidden border border-border">
            <img src={message.imageUrl} alt="Generated" className="w-full" loading="lazy" />
          </div>
          <a href={message.imageUrl} download className="inline-flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground">
            <Download size={12} /> Download
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up group`}>
      <div
        className={`max-w-[80%] rounded-lg overflow-hidden ${
          isUser
            ? 'bg-primary/10 border border-primary/30'
            : 'bg-card border'
        }`}
        style={!isUser ? { borderColor: message.modelColor + '55' } : undefined}
      >
        {!isUser && (
          <ModelHeader label={message.modelLabel} color={message.modelColor} />
        )}
        {isUser && (
          <div className="px-3 py-1 border-b border-primary/20 bg-primary/15 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-station text-primary tracking-widest">YOU</span>
          </div>
        )}
        <div className="px-4 py-3">
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words font-body">
            {message.content}
            {isStreaming && <TypingCursor />}
          </div>
          {!isUser && !isStreaming && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground p-1 rounded">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button onClick={handleSpeak} className="text-muted-foreground hover:text-foreground p-1 rounded">
              {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
export default MessageBubble;

const ModelHeader: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div
    className="px-3 py-1.5 border-b flex items-center gap-2 relative overflow-hidden"
    style={{
      background: `linear-gradient(90deg, ${color}26 0%, ${color}10 60%, transparent 100%)`,
      borderColor: `${color}55`,
    }}
  >
    {/* Ticket-stub edge */}
    <span
      className="absolute left-0 top-0 bottom-0 w-1"
      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
    />
    <Cpu size={12} style={{ color }} />
    <span
      className="led-dot"
      style={{ color }}
    />
    <span className="text-[10px] font-station tracking-widest" style={{ color }}>
      {label || 'ROUTING…'}
    </span>
    <span className="ml-auto text-[9px] font-station text-muted-foreground/70 tracking-widest">
      ✦ PLATFORM 01 · ARRIVED
    </span>
  </div>
);