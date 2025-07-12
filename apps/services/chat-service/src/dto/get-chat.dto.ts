import { Message, User } from '@i4you/shared';
import { Chat } from '../chat/schemas/chat.schema';

export interface ChatPreview {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    initials?: string;
    isOnline?: boolean;
    lastActive?: string;
  };
  messages: Message[];
  unreadCount: number;
}

export class ChatResponseDto implements ChatPreview {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    initials?: string;
    isOnline?: boolean;
    lastActive?: string;
  };
  messages: Message[];
  unreadCount: number;

  constructor(chat: Chat, user: User) {
    // eslint-disable-next-line
    this.id = chat.id;
    this.participant = {
      id: user.id,
      name: user.name,
      avatar: user.photos[0],
      initials: user.name
        .split(' ')
        .map((n) => n.charAt(0).toUpperCase())
        .join(''),
      isOnline: true,
      lastActive: 'Not Implemented',
    };
    this.messages = [
      {
        id: 'message-id-placeholder',
        content: 'Hi',
        sender: '681dde7f1085d20ffc7acda3',
        timestamp: new Date().toISOString(),
        status: 'read',
      },
    ] as unknown as ChatPreview['messages'];
    this.unreadCount = 2;
  }
}
