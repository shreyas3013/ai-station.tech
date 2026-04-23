import React, { useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import MessageBubble from './MessageBubble';

const MessageList: React.FC = () => {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-2">AI STATION</h1>
        <p className="text-muted-foreground font-station text-sm">UNIFIED AI PLATFORM — ALL MODELS, ONE INTERFACE</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8 max-w-xl">
          {[
            { emoji: '💻', text: 'Write me a React component' },
            { emoji: '🧠', text: 'Analyze the pros and cons' },
            { emoji: '✍️', text: 'Write a blog article about AI' },
            { emoji: '🎨', text: 'Generate an image of a sunset' },
            { emoji: '📰', text: 'Latest news about technology' },
            { emoji: '❓', text: 'What is quantum computing?' },
          ].map((s) => (
            <button
              key={s.text}
              className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-lg">{s.emoji}</span>
              <p className="mt-1">{s.text}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default MessageList;