'use client';

import { create } from 'zustand';
import { getSocketClient } from '@/lib/websocket';
import ChatService from '@/services/chat.service';
import { Message } from '@/types';
import { StateCreator } from 'zustand/index';
import { devtools } from 'zustand/middleware';
import chatService from '@/services/chat.service';
import AuthStore from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { router } from 'next/client';

export type ChatUser = {
  id: string;
  participant: {
    id: string;
    name: string;
    initials?: string;
    avatar: string;
    lastActive?: number;
    isOnline?: boolean;
    lastMessage?: Message;
  };
}

export interface ChatPreview {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    initials?: string;
    isOnline?: boolean;
    lastActive?: number;
  };
  messages?: Message[];
  unreadCount: number;
}

interface ChatStore {
  chats: ChatPreview[];
  messages: Record<string, Message[]>;
  loadedPages: { [chatId: string]: Set<number> };
  hasNoNext: { [chatId: string]: boolean };
  currentChat: ChatUser | null;
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'connecting';
  isTyping: Record<string, boolean>;
  isLoading: boolean;
  isMessagesLoading: boolean;
  chatsError: string | null;
  setCurrentChat: (user: ChatUser) => void;
  initiateChatUser: (userId: string) => void;
  onMessage: (onMessageHandler: (message: Message) => void) => void;
  fetchMessages: (chatId: string, page: number) => void;
  joinChat: (chatId: string) => boolean;
  newChat: (chat: ChatPreview, messages: Message) => void;
  newMessage: (chat: Message) => void;
  leaveChat: (chatId: string) => boolean;
  sendMessage: (chatId: string, content: string) => void;
  sendNewChatMessage: (newUserId: string, content: string) => void;
  loadMoreMessages: (chatId: string, page: number) => void;
  markAsRead: (chatId: string) => void;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
}

const chatStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (set, get) => {
  let wsClient;

  wsClient = getSocketClient();

  if (typeof window !== 'undefined') {
    wsClient.connect();
  }

  const { showNotification } = useNotificationStore.getState();

  let messageCallback: ((msg: Message) => void) | null = null;

  wsClient.on('message', (message: any) => {

    // TODO needs to be replaced with a proper type
    const newMessage: Omit<Message, 'chatId' | 'id'> & { _id: string } = {
      sender: message.sender,
      content: message.content,
      timestamp: message.timestamp,
      status: 'delivered',
      _id: message.id || `m${Date.now()}`,
    };

    set((state) => {
      const chatMessages = [...(state.messages[message.chatId] || []), newMessage];

      return { messages: { ...state.messages, [message.chatId]: chatMessages } };
    }, undefined, 'chatStore/message/updateState');

    if (messageCallback) {
      messageCallback(message);
    }

    showNotification({
      content: `New message from ${message.sender.name}`,
      type: 'info',
      image: message.sender.avatar,
      color: '#cbc4d7',
      onClick: () => router.push(`/chat/${message.chatId}`),
    });
  });

  wsClient.on('typing', (payload: { sender: string; isTyping: boolean }) => {
    set((state) => ({
      isTyping: { ...state.isTyping, [payload.sender]: payload.isTyping },
    }));
  });

  wsClient.on('read_receipt', (payload: { sender: string; chatId: string }) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [payload.chatId]: state.messages[payload.chatId]?.map((msg) => ({ ...msg, status: 'read' })),
      },
    }));
  });

  wsClient.on('newChat', (payload: ChatPreview) => {
    set((state) => ({
      chats: [payload, ...state.chats],
    }));

    // set((state) => ({
    //   messages: { ...state.messages, [payload.id]: payload.messages || [] },
    // }), undefined, 'chatStore/newChat/updateState');
  });

  wsClient.on('chatUpdated', (payload: ChatPreview) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === payload.id ? { ...chat, ...payload } : chat,
      ),
    }), undefined, 'chatStore/chatUpdated/updateState');
  });

  wsClient.on('messagesPage', ({ chatId, messages, page }) => {
    set((state) => {
      const loadedPages = state.loadedPages[chatId] || new Set();

      if (loadedPages.has(page)) {
        console.log(`Page ${page} already loaded for chat ${chatId}`);
        return state;
      }

      const existingMessages = state.messages[chatId] || [];

      return {
        messages: {
          ...state.messages,
          [chatId]: [...messages.reverse(), ...existingMessages],
        },
        loadedPages: {
          ...state.loadedPages,
          [chatId]: new Set([...loadedPages, page]),
        },
      };
    });
  });

  wsClient.on('chatDeleted', (payload: { chatId: string }) => {
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== payload.chatId),
    }));
  });

  wsClient.onStatusChange((status) => {
    set({ connectionStatus: status });
  });

  (async () => {
    set({ isLoading: true, chatsError: null }, undefined, 'chatStore/initial');

    const { data, error } = await ChatService.fetchChats();
    if (error) {
      set({ isLoading: false, chatsError: error });
    } else {
      const messagesMap: Record<string, Message[]> = {};

      const chats = data.map((chat: ChatPreview) => {
        messagesMap[chat.id] = chat.messages || [];
        return chat;
      });

      set({
        chats,
        messages: messagesMap,
        isLoading: false,
      }, undefined, 'chatStore/initial/updateState');
    }
  })();

  return {
    chats: [],
    messages: {},
    loadedPages: {},
    hasNoNext: {},
    currentChat: null,
    connectionStatus: 'connecting' as 'connecting' | 'connected' | 'disconnected' | 'error',
    isTyping: {},
    isLoading: true,
    isMessagesLoading: false,
    chatsError: null,

    setCurrentChat: (user) => set({ currentChat: user }),

    initiateChatUser: async (chatId) => {
      set({ isLoading: true });
      const { error, data } = await chatService.getInitialChatUser(chatId);

      if (error) {
        console.error('Error fetching chat user:', error);
        return null;
      }

      set({
        currentChat: data as ChatUser,
        isLoading: false,
      }, undefined, 'chatStore/fetchChatUser/updateState');
    },

    fetchMessages: async (chatId, page) => {

      if (!chatId) {
        console.warn('Chat ID is required to fetch messages');
        return;
      }

      const loadedPages = get().loadedPages[chatId] || new Set();

      if (get().hasNoNext[chatId] || loadedPages.has(page)) {
        console.warn('No next page or already loaded for chat:', chatId, 'page:', page);
        return;
      }

      set({ isMessagesLoading: true }, undefined, 'chatStore/fetchMessages/start');
      const { error, data } = await chatService.fetchMessages(chatId, page);

      if (error) {
        console.error('Error fetching messages for chat ', chatId, ': ', error);
        set({ isMessagesLoading: false, chatsError: error }, undefined, 'chatStore/fetchMessages/error');
        return;
      }

      const { messages, page: responsePage, hasNextPage } = data;

      if (get().loadedPages[chatId]?.has(responsePage)) {
        set({ isMessagesLoading: false }, undefined, 'chatStore/fetchMessages/alreadyLoaded');
        return;
      }

      set({
        hasNoNext: { ...get().hasNoNext, [chatId]: !hasNextPage },
        loadedPages: {
          ...get().loadedPages,
          [chatId]: new Set([...(get().loadedPages[chatId] || []), responsePage]),
        },
        messages: { ...get().messages, [chatId]: [...(get().messages[chatId] || []), ...messages] },
        isMessagesLoading: false,
      }, undefined, 'chatStore/fetchMessages/success');
    },

    newChat: (chat, message) => {
      set((state) => ({
        chats: [chat, ...state.chats],
      }), undefined, 'chatStore/newChat/updateChat/success');

      showNotification({
        title: `New message from ${chat.participant.name}`,
        content: message.content,
        type: 'info',
        duration: 20000,
        image: chat.participant.avatar,
        color: '#591a4b',
        href: `/messages/${chat.participant.id}`,
      });
    },

    newMessage: (message) => {

      const chatMessages = [message, ...(get().messages[message.chatId] || [])];

      const chat = get().chats.find((c) => c.id === message.chatId);

      if (!chat) {
        console.warn(`Chat with ID ${message.chatId} not found for new message`);
        return;
      }

      set((state) => ({
        messages: { ...state.messages, [message.chatId]: chatMessages },
      }), undefined, 'chatStore/newMessage/updateState');

      showNotification({
        title: `New message from ${chat.participant.name}`,
        content: message.content,
        type: 'info',
        duration: 20000,
        image: chat.participant.avatar,
        color: '#591a4b',
        href: `/messages/${chat.participant.id}`,
      });
    },

    joinChat: (chatId) => {
      if (wsClient.isConnected()) {
        return wsClient.joinRoom(chatId);
      }
      return false;
    },

    leaveChat: (chatId) => {
      if (wsClient.isConnected()) {
        return wsClient.leaveRoom(chatId);
      }
      return false;
    },

    sendMessage: (chatId, content) => {
      if (!content.trim() || !AuthStore.getState().user) return;

      const newMessage: Message = {
        id: `m${Date.now()}`,
        chatId: chatId,
        content,
        sender: AuthStore.getState().user?.id!,
        timestamp: Date.now(),
        status: 'pending',
      };

      set((state) => {
        const chatMessages = [newMessage, ...(state.messages[chatId] || [])];
        const updatedMessages = { ...state.messages, [chatId]: chatMessages };
        const updatedChats = state.chats?.map((chat) =>
          chat.id === chatId ? { ...chat, lastMessage: newMessage } : chat,
        ) || null;
        return { messages: updatedMessages, chats: updatedChats };
      }, undefined, 'chatStore/sendMessage/updateState');

      const status = wsClient.send('message', {
        chatId,
        content,
        timestamp: newMessage.timestamp,
      });

      if (status) {
        console.log('Message sent successfully:', newMessage);
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: state.messages[chatId].map((msg) =>
              msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg,
            ),
          },
        }));
      } else {
        console.error('Failed to send message:', newMessage);
        return;
      }
    },

    sendNewChatMessage: (newUserId, content) => {
      if (!content.trim() || !AuthStore.getState().user) return;


      const status = wsClient.send('createRoom', {
        newUserId,
        message: {
          content,
          timestamp: Date.now().toString(),
        },
      });

      if (status) {
        console.log('new Chat Created successfully for user:', newUserId);
      } else {
        console.error('Failed to  create Chat for user:', newUserId);
      }
    },

    onMessage: (handler: (msg: Message) => void) => {
      messageCallback = handler;
    },

    loadMoreMessages: (chatId, page) => {
      wsClient.send('getMessages', { chatId, page });
    },

    markAsRead: (chatId) => {
      wsClient.send('read_receipt', { chatId });
    },

    startTyping: (chatId) => {
      wsClient.send('typing', { chatId, isTyping: true });
    },

    stopTyping: (chatId) => {
      wsClient.send('typing', { chatId, isTyping: false });
    },
  };
};

export const useChatStore = create<ChatStore>()(
  devtools(
    chatStore,
    { name: 'chat-store', enabled: true },
  ),
);

export default useChatStore;
