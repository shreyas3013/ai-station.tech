import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelUsed: string;
  modelLabel: string;
  modelColor: string;
  isImage?: boolean;
  imageUrl?: string;
  timestamp: Date;
}

interface ChatStore {
  messages: Message[];
  sessionId: string | null;
  isTempMode: boolean;
  manualModel: string | null;
  isStreaming: boolean;
  addMessage: (msg: Message) => void;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  setSessionId: (id: string | null) => void;
  setTempMode: (val: boolean) => void;
  setManualModel: (model: string | null) => void;
  setIsStreaming: (val: boolean) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      sessionId: null,
      isTempMode: false,
      manualModel: null,
      isStreaming: false,
      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),
      updateLastMessage: (content) =>
        set((state) => {
          const msgs = [...state.messages];
          if (msgs.length > 0) msgs[msgs.length - 1].content = content;
          return { messages: msgs };
        }),
      clearMessages: () => set({ messages: [], sessionId: null }),
      setSessionId: (id) => set({ sessionId: id }),
      setTempMode: (val) => set({ isTempMode: val }),
      setManualModel: (model) => set({ manualModel: model }),
      setIsStreaming: (val) => set({ isStreaming: val }),
    }),
    {
      name: 'ai-station-chat',
      partialize: (state) => ({
        messages: state.isTempMode ? [] : state.messages,
        sessionId: state.isTempMode ? null : state.sessionId,
      }),
    }
  )
);