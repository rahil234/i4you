'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send, Check, CheckCheck, Clock, AlertCircleIcon, Video, Phone } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import useChatStore, { ChatUser } from '@/store/chatStore';
import { useDebounce } from '@/hooks/use-debounce';
import useAuthStore from '@/store/authStore';
import { formatTimestamp } from '@/utils/formatTimestamp';
import { useNow } from '@/context/NowContext';
import { Message } from '@/types';
import VideoCall from '@/components/user/VideoCall';
import useVideoCallStore from '@/store/videoStore';

interface ChatProps {
  chat: ChatUser;
  userId: string;
  isNewChat?: boolean;
}

export function Chat({ chat, userId, isNewChat }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  const debouncedIsComposing = useDebounce(isComposing, 500);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);

  const [page, setPage] = useState(1);
  const [isPrepending, setIsPrepending] = useState(false);

  const now = useNow();
  const { user } = useAuthStore();

  const {
    messages,
    joinChat,
    leaveChat,
    sendMessage,
    sendNewChatMessage,
    markAsRead,
    isTyping,
    startTyping,
    stopTyping,
    fetchMessages,
    isMessagesLoading,
    onMessage,
  } = useChatStore();

  const { placeCall } = useVideoCallStore();

  useEffect(() => {
    if (chat?.id && !isJoined) {
      setIsJoined(joinChat(chat.id));
    }
  }, [userId, chat, joinChat, leaveChat]);

  useEffect(() => {
    if (chat && !chatMessages.length && !isMessagesLoading) {
      fetchMessages(chat?.id, 0);
    }
  }, [chat?.id]);

  useEffect(() => {
    const el = messageContainerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [chat.id, page]);

  onMessage(message => {
    console.log('New message received from comp: ', message);
    throw new Error('This is a test error from the chat component');
  });

  useEffect(() => {
    const lastMessage = chatMessages.at(-1);
    if (lastMessage && lastMessage.sender !== user?.id) {
      markAsRead(chat.id);
    }
  }, [chatMessages, userId, chat.id, markAsRead]);

  useEffect(() => {
    if (!chat) return;
    const chatMessages = messages[chat.id] || [];
    setChatMessages([...chatMessages].reverse());
  }, [messages, chat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      prevScrollHeight.current = messagesEndRef.current.scrollHeight;
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const latestMessage = chatMessages.at(0);

    if (!isPrepending && latestMessage?.sender === user?.id) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages[chat.id]]);

  useEffect(() => {
    const el = messageContainerRef.current;
    if (!el || !isPrepending) return;

    const newHeight = el.scrollHeight;
    el.scrollTop = newHeight - prevScrollHeight.current;
    setIsPrepending(false);
  }, [messages, isPrepending]);

  useEffect(() => {
    if (!chat) return;
    if (debouncedIsComposing) {
      startTyping(chat?.id);
    } else {
      stopTyping(chat?.id);
    }
  }, [debouncedIsComposing, userId, startTyping, stopTyping]);

  const handleScroll = () => {
    const el = messageContainerRef.current;
    if (!el) return;

    if (el.scrollTop < 10 && el.scrollHeight > prevScrollHeight.current) {
      prevScrollHeight.current = el.scrollHeight;
      setIsPrepending(true);
      fetchMessages(chat.id, page);
      setPage((prev) => prev + 1);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    if (isNewChat) {
      sendNewChatMessage(userId, newMessage);
    } else {
      sendMessage(chat.id, newMessage);

    }

    setNewMessage('');
    setIsComposing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setIsComposing(e.target.value.length > 0);
  };

  const renderStatusIcon = (status?: 'pending' | 'sent' | 'delivered' | 'read' | 'error') => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-white" />;
      case 'sent':
        return <Check className="h-3 w-3 text-white" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-white" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-cyan-500" />;
      default:
        return <AlertCircleIcon className="h-3 w-3 text-red-500" />;
    }
  };

  const handleStartCall = async () => {
    await placeCall(chat.participant);
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
              chat.participant.lastActive ?
                `Last active ${formatTimestamp(chat.participant.lastActive, now)}` : <></>
            )}
          </p>
        </div>


        {/* Call buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleStartCall}>
            <Video className="h-5 w-5 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <Phone className="h-5 w-5 text-green-600" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {/* Spinner at the top */}
        {isMessagesLoading && (
          <div className="flex justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={cn('flex', message.sender === user?.id ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-xl px-3 py-2 text-xs relative',
                message.sender === user?.id
                  // ? 'bg-gradient-to-br from-blue-600/[0.9] via-fuchsia-600 to-fuchsia-700 text-white'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-200',
              )}
            >
              <p className="break-words pr-14 text-xs leading-snug">
                {message.content}
              </p>

              <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[9px] opacity-70">
                <span>{formatTimestamp(message.timestamp, now)}</span>
                {message.sender === user?.id && renderStatusIcon(message.status)}
              </div>
            </div>
          </div>
        ))}

        {isTyping[userId] && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-3xl px-2 py-1 text-sm">
              <div className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
