'use client';

import { create } from 'zustand';
import { getSocketClient } from '@/lib/websocket';
import ChatService from '@/services/chat.service';
import { Chat, Message } from '@/types';
import useAuthStore from '@/store/authStore';
import { User } from '@i4you/shared';

export type ChatUser = Partial<User> & {
  id: string;
  initials?: string;
  avatar: string;
  lastActive?: string;
  isOnline?: boolean;
  lastMessage?: Message;
}

interface ChatStore {
  chats: Chat[];
  messages: Record<string, Message[]>;
  currentUser: ChatUser;
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'connecting';
  isTyping: Record<string, boolean>;
  isLoadingChats: boolean;
  chatsError: string | null;
  setChats: (chats: Chat[]) => void;
  setCurrentUser: (user: ChatUser) => void;
  joinChat: (chatId: string) => void;
  sendMessage: (chatId: string, content: string) => void;
  markAsRead: (chatId: string) => void;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
}

const chat1 = {
  id: '1',
  participants: [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      lastActive: '2023-10-01T12:00:00Z',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://example.com/avatar2.jpg',
      lastActive: '2023-10-01T12:00:00Z',
      isOnline: false,
    },
  ],
  lastMessage: {
    id: 'm1',
    chatId: '1',
    content: 'Hello!',
    sender: '1',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  unreadCount: 0,
};

const useChatStore = create<ChatStore>((set, get) => {
  const initialState = {
    chats: [chat1],
    messages: {},
    currentUser: useAuthStore.getState().user as ChatUser,
    connectionStatus: 'connecting' as 'connecting' | 'connected' | 'disconnected' | 'error',
    isTyping: {},
    isLoadingChats: true,
    chatsError: null,
  };

  let wsClient;

  wsClient = getSocketClient();

  // Message handler
  wsClient.onMessage((message) => {
    if (message.type === 'message') {
      const newMessage: Message = {
        id: message.id,
        chatId: message.chatId,
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp,
        status: 'delivered',
      };

      set((state) => {
        const chatMessages = [...(state.messages[message.chatId] || []), newMessage];
        const updatedMessages = { ...state.messages, [message.chatId]: chatMessages };

        const updatedChats = state.chats?.map((chat) =>
          chat.id === message.chatId
            ? { ...chat, lastMessage: newMessage, unreadCount: chat.unreadCount + 1 }
            : chat,
        ) || null;

        return { messages: updatedMessages, chats: updatedChats };
      });
    } else if (message.type === 'typing') {
      set((state) => ({
        isTyping: { ...state.isTyping, [message.chatId]: message.isTyping },
      }));
    } else if (message.type === 'status') {
      // Handle user status changes if needed
    }
  });

  // Status handler
  wsClient.onStatusChange((status) => {
    set({ connectionStatus: status });
  });

  if (typeof window !== 'undefined') {
    wsClient.connect();
  }

  // Fetch chats asynchronously
  (async () => {
    try {
      const { data, error } = await ChatService.fetchChats();
      if (error) {
        set({ isLoadingChats: false, chatsError: error });
      } else {
        set({ chats: data, isLoadingChats: false });
      }
    } catch (err) {
      set({ isLoadingChats: false, chatsError: 'Failed to fetch chats' });
    }
  })();

  return {
    ...initialState,
    setChats: (chats) => set({ chats }),
    setCurrentUser: (user) => set({ currentUser: user }),
    joinChat: (chatId) => {
      if (wsClient.send({ type: 'ping' })) {
        wsClient.joinRoom(chatId);
      } else {
        const off = wsClient.onStatusChange((status) => {
          if (status === 'connected') {
            wsClient.joinRoom(chatId);
            off();
          }
        });
      }
    },
    sendMessage: (chatId, content) => {

      if (!content.trim() || !get().currentUser) return;

      const newMessage: Message = {
        id: `m${Date.now()}`,
        chatId,
        content,
        sender: get().currentUser.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };

      set((state) => {
        const chatMessages = [...(state.messages[chatId] || []), newMessage];
        const updatedMessages = { ...state.messages, [chatId]: chatMessages };
        const updatedChats = state.chats?.map((chat) =>
          chat.id === chatId ? { ...chat, lastMessage: newMessage } : chat,
        ) || null;
        return { messages: updatedMessages, chats: updatedChats };
      });

      wsClient.send({
        type: 'message',
        chatId,
        content,
        sender: get().currentUser.id,
      });

      // Simulate delivery status
      setTimeout(() => {
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId].map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg,
            ),
          },
        }));
      }, 1000);
    },
    markAsRead: (chatId) => {
      set((state) => ({
        chats: state.chats?.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
        ) || null,
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId]?.map((msg) =>
            msg.sender !== state.currentUser?.id ? { ...msg, status: 'read' } : msg,
          ) || [],
        },
      }));

      wsClient.send({ type: 'read_receipt', chatId });
    },
    startTyping: (chatId) => {
      wsClient.send({ type: 'typing', chatId, isTyping: true });
    },
    stopTyping: (chatId) => {
      wsClient.send({ type: 'typing', chatId, isTyping: false });
    },
  };
});

export default useChatStore;