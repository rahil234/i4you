'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ConversationsList } from '@/components/user/conversations-list';
import { Chat } from '@/components/user/chat';
import { UserLayout } from '@/components/user-layout';
import useChatStore from '@/store/chatStore';

export default function ChatPage() {
  const params = useParams();
  const userId = params.id as string;
  const { chats, isLoading, initiateChatUser, currentChat } = useChatStore();

  const [isNewChat, setIsNewChat] = useState(true);
  const [chat, setChat] = useState(currentChat);

  const chatUser = chats.find(chat => chat.participant.id === userId);

  useEffect(() => {
    if (!isLoading && !chatUser && userId && !currentChat) {
      initiateChatUser(userId);
    }
  }, [userId, initiateChatUser, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setChat(currentChat);
    }
  }, [currentChat, isLoading]);

  useEffect(() => {
    const matchedChat = chats.find((c) => c.participant.id === userId) || null;
    if (matchedChat) {
      setIsNewChat(false);
      setChat(matchedChat);
    }
  }, [chats, userId]);

  if (isLoading) {
    return (
      <UserLayout>
        <div className="md:container mx-auto max-w-6xl md:p-4 md:pt-6 h-[calc(100vh-64px)]">
          <div className="md:border md:rounded-lg md:shadow-sm h-full overflow-hidden bg-white">
            <div className="md:grid md:grid-cols-[350px_1fr] h-full">
              <div className="hidden md:block">
                {/* Show sidebar skeleton */}
                <div className="p-4 space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 animate-pulse rounded" />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-gray-500">Loading chat...</p>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="md:container mx-auto max-w-6xl md:p-4 md:pt-6 h-[calc(100vh-64px)]">
        <div className="md:border md:rounded-lg md:shadow-sm h-full overflow-hidden bg-white">
          <div className="md:grid md:grid-cols-[350px_1fr] h-full">
            <div className="hidden md:block">
              <ConversationsList selectedId={userId} />
            </div>
            {chat ? (
              <Chat chat={chat} userId={userId} isNewChat={isNewChat} />
            ) : (
              <div className="flex flex-col h-full items-center justify-center">
                <p className="text-muted-foreground">Chat not found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
