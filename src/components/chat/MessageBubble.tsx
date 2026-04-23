import React, { useState, useCallback } from 'react';
import { Copy, Check, Volume2, VolumeX, Download } from 'lucide-react';
import { Message } from '@/store/chatStore';
import ModelBadge from './ModelBadge';
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
          <ModelBadge label={message.modelLabel} color={message.modelColor} />
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
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-primary/10 border-l-[3px] border-l-primary'
            : 'bg-card border-l-[3px]'
        }`}
        style={!isUser ? { borderLeftColor: message.modelColor } : undefined}
      >
        {!isUser && (
          <div className="mb-2">
            <ModelBadge label={message.modelLabel} color={message.modelColor} />
          </div>
        )}
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
  );
});

MessageBubble.displayName = 'MessageBubble';
export default MessageBubble;