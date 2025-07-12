'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send, Check, CheckCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import useChatStore from '@/store/chatStore';
import { useDebounce } from '@/hooks/use-debounce';
import useAuthStore from '@/store/authStore';
import { Message } from '@/types';
import { formatTimestamp } from '@/utils/formatTimestamp';

interface ChatProps {
  userId: string;
}

export function Chat({ userId }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>();
  const [isComposing, setIsComposing] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const debouncedIsComposing = useDebounce(isComposing, 500);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    joinChat,
    leaveChat,
    sendMessage,
    markAsRead,
    isTyping,
    startTyping,
    stopTyping,
    currentChat,
    chats,
  } = useChatStore();

  const [chat, setChat] = useState(currentChat);

  const { user } = useAuthStore();

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chat) {
      setChatMessages(messages[chat?.id]);
      console.log('Chat messages updated:', messages[chat?.id]);
    }
  }, [userId, chat, messages]);


  useEffect(() => {
    const matchedChat = chats.find((c) => c.participant.id === userId) || null;
    if (matchedChat) {
      setIsNewChat(false);
      setChat(matchedChat);
    }
  }, [chats, userId]);


  useEffect(() => {
    if (chat && !isJoined) setIsJoined(joinChat(chat.id));
  }, [userId, chat, joinChat, leaveChat]);

  useEffect(() => {
    markAsRead(userId);
  }, [userId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);


  useEffect(() => {
    if (!chat) return;
    if (debouncedIsComposing) {
      startTyping(chat?.id);
    } else {
      stopTyping(chat?.id);
    }
  }, [debouncedIsComposing, userId, startTyping, stopTyping]);

  if (!chat || !userId) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-muted-foreground">Chat not found</p>
      </div>
    );
  }
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    sendMessage(chat.id, newMessage, isNewChat);
    setNewMessage('');
    setIsComposing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setIsComposing(e.target.value.length > 0);
  };


  // Render status icon based on message status
  const renderStatusIcon = (status?: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-cyan-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="p-3 border-b flex items-center gap-3 bg-white">
        <Link href="/messages" className="md:hidden mr-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>

        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.participant.avatar} alt={chat.participant.name} />
          <AvatarFallback>{chat.participant.initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-medium text-sm">{chat.participant.name}</h3>
          <p className="text-xs text-muted-foreground">
            {chat.participant.isOnline ? (
              <span className="text-green-500">Online now</span>
            ) : (
              `Last active ${chat.participant.lastActive}`
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatMessages?.length && chatMessages.map((message, index) => (
          <div
            key={index}
            className={cn('flex', message.sender === user?.id ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-lg px-4 py-2 text-sm',
                message.sender === user?.id
                  ?
                  'bg-blue-500 text-white' :
                  'bg-white text-gray-800 border border-gray-200',
              )}
            >
              <p className="mb-1">{message.content}</p>
              <div className="flex justify-end items-center gap-1 text-xs opacity-70">
                <span>{formatTimestamp(message.timestamp)}</span>
                {message.sender === user?.id && renderStatusIcon(message.status)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping[userId] && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2 text-sm">
              <div className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                  •
                </span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>
                  •
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t shrink bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={handleInputChange}
          />
          <Button type="submit" size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
