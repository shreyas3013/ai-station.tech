import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import ManualSelector from '@/components/model/ManualSelector';

const ChatPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-background relative">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <ManualSelector />
        <MessageList />
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;