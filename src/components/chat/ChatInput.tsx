import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Mic, MicOff, Square, Sparkles, Loader2 } from 'lucide-react';
import { useChatStore, Message } from '@/store/chatStore';
import { sendMessage } from '@/lib/sendMessage';
import { startVoiceInput } from '@/lib/voiceInput';
import { routePrompt } from '@/lib/router';
import ModelBadge from './ModelBadge';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { enhancePrompt, suggestCompletions } from '@/lib/enhance';
import { toast } from 'sonner';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestAbortRef = useRef<AbortController | null>(null);
  const suggestTimerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stopVoiceRef = useRef<(() => void) | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, addMessage, updateLastMessage, setIsStreaming, isStreaming, manualModel, sessionId, setSessionId, isTempMode } = useChatStore();
  const user = useAuthStore((s) => s.user);

  const previewDecision = input.trim() ? (manualModel ? null : routePrompt(input)) : null;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  // Debounced autocomplete suggestions
  useEffect(() => {
    if (suggestTimerRef.current) window.clearTimeout(suggestTimerRef.current);
    suggestAbortRef.current?.abort();
    const trimmed = input.trim();
    if (trimmed.length < 4 || isStreaming) {
      setSuggestions([]);
      return;
    }
    suggestTimerRef.current = window.setTimeout(async () => {
      const ctrl = new AbortController();
      suggestAbortRef.current = ctrl;
      try {
        const s = await suggestCompletions(trimmed, ctrl.signal);
        if (!ctrl.signal.aborted) setSuggestions(s);
      } catch {
        // silent
      }
    }, 600);
    return () => {
      if (suggestTimerRef.current) window.clearTimeout(suggestTimerRef.current);
    };
  }, [input, isStreaming]);

  const persistMessage = useCallback(async (msg: { session_id: string; role: string; content: string; model_used: string; model_label: string; is_image?: boolean; image_url?: string }) => {
    if (isTempMode) return;
    await supabase.from('messages').insert({
      chat_id: msg.session_id,
      role: msg.role,
      content: msg.content,
      model_used: msg.model_used,
      routing_info: { label: msg.model_label },
      is_image: msg.is_image || false,
      image_url: msg.image_url || null,
    });
  }, [isTempMode]);

  const ensureSession = useCallback(async (): Promise<string> => {
    if (sessionId) return sessionId;
    if (isTempMode || !user) return 'temp';
    const { data } = await supabase.from('chats').insert({ user_id: user.id, title: input.slice(0, 40) || 'New Chat' }).select('id').single();
    if (data) {
      setSessionId(data.id);
      return data.id;
    }
    return 'temp';
  }, [sessionId, isTempMode, user, input, setSessionId]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    const prompt = input.trim();
    setInput('');

    const sid = await ensureSession();
    const userMsg: Message = {
      id: uuidv4(), role: 'user', content: prompt,
      modelUsed: '', modelLabel: '', modelColor: '',
      timestamp: new Date(),
    };
    addMessage(userMsg);
    persistMessage({ session_id: sid, role: 'user', content: prompt, model_used: '', model_label: '' });

    const assistantId = uuidv4();
    let accumulated = '';
    setIsStreaming(true);

    addMessage({
      id: assistantId, role: 'assistant', content: '',
      modelUsed: '', modelLabel: '...', modelColor: '#666',
      timestamp: new Date(),
    });

    const controller = new AbortController();
    abortRef.current = controller;

    const history = messages.map(m => ({ role: m.role, content: m.content }));

    await sendMessage(
      prompt, history, manualModel,
      (token) => {
        accumulated += token;
        updateLastMessage(accumulated);
      },
      (decision) => {
        setIsStreaming(false);
        persistMessage({ session_id: sid, role: 'assistant', content: accumulated, model_used: decision.modelId, model_label: decision.label });
      },
      (url, decision) => {
        updateLastMessage('');
        const msgs = useChatStore.getState().messages;
        const last = msgs[msgs.length - 1];
        if (last) {
          useChatStore.setState({
            messages: msgs.map(m => m.id === last.id ? { ...m, isImage: true, imageUrl: url, modelUsed: decision.modelId, modelLabel: decision.label, modelColor: decision.color } : m)
          });
        }
        setIsStreaming(false);
        persistMessage({ session_id: sid, role: 'assistant', content: url, model_used: decision.modelId, model_label: decision.label, is_image: true, image_url: url });
      },
      (errMsg) => {
        updateLastMessage(`Error: ${errMsg}`);
        setIsStreaming(false);
      },
      controller.signal
    );
  }, [input, isStreaming, messages, manualModel, addMessage, updateLastMessage, setIsStreaming, ensureSession, persistMessage]);

  const handleAbort = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, [setIsStreaming]);

  const handleVoice = useCallback(() => {
    if (isListening) {
      stopVoiceRef.current?.();
      setIsListening(false);
    } else {
      setIsListening(true);
      stopVoiceRef.current = startVoiceInput(
        (text) => { setInput(text); setIsListening(false); },
        () => setIsListening(false)
      );
    }
  }, [isListening]);

  const handleEnhance = useCallback(async () => {
    if (!input.trim() || enhancing) return;
    setEnhancing(true);
    try {
      const better = await enhancePrompt(input.trim());
      setInput(better);
      toast.success('Prompt enhanced');
    } catch (e) {
      toast.error('Could not enhance prompt');
    } finally {
      setEnhancing(false);
    }
  }, [input, enhancing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
      {isTempMode && (
        <div className="mb-2 px-3 py-1.5 rounded bg-station-gold/10 border border-station-gold/30 text-station-gold text-xs font-station">
          TEMP MODE — THIS CONVERSATION WILL NOT BE SAVED
        </div>
      )}
      {suggestions.length > 0 && !isStreaming && (
        <div className="max-w-4xl mx-auto mb-2 flex flex-wrap gap-2">
          <span className="text-[10px] font-station text-muted-foreground self-center">SUGGESTIONS →</span>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setInput(s); setSuggestions([]); }}
              className="text-xs px-2.5 py-1 rounded-full border border-station-cyan/30 bg-station-cyan/5 text-station-cyan hover:bg-station-cyan/15 transition-colors truncate max-w-xs"
              title={s}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="w-full resize-none rounded-lg border border-border bg-input px-4 py-3 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
          />
          {input.length > 500 && (
            <span className="absolute top-2 right-20 text-xs text-muted-foreground">{input.length}</span>
          )}
          {previewDecision && (
            <div className="absolute bottom-1 left-2">
              <ModelBadge label={previewDecision.label} color={previewDecision.color} reason={previewDecision.reason} />
            </div>
          )}
        </div>

        <button
          onClick={handleEnhance}
          disabled={!input.trim() || enhancing || isStreaming}
          title="Enhance prompt"
          className="p-3 rounded-lg border border-station-gold/40 bg-station-gold/10 text-station-gold hover:bg-station-gold/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {enhancing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        </button>

        <button onClick={handleVoice} className={`p-3 rounded-lg border border-border transition-colors ${isListening ? 'bg-destructive text-destructive-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}>
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {isStreaming ? (
          <button onClick={handleAbort} className="p-3 rounded-lg bg-destructive text-destructive-foreground">
            <Square size={18} />
          </button>
        ) : (
          <button onClick={handleSend} disabled={!input.trim()} className="p-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
            <Send size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;