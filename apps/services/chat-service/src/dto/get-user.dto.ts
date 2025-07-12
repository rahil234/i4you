import { User } from '@i4you/shared';

export interface UserPreview {
  participant: {
    id: string;
    name: string;
    avatar: string;
    initials?: string;
    isOnline?: boolean;
    lastActive?: string;
  };
  unreadCount: number;
}

export class UserResponseDto implements UserPreview {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    initials?: string;
    isOnline?: boolean;
    lastActive?: string;
  };
  lastMessage?: {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
    status?: 'sent' | 'delivered' | 'read';
  };
  unreadCount: number;

  constructor(user: User) {
    this.participant = {
      id: user.id,
      name: user.name,
      avatar: user.photos[0],
      initials: user.name
        .split(' ')
        .map((n) => n.charAt(0).toUpperCase())
        .join(''),
      isOnline: false, // TODO implement online status
      lastActive: Date.now().toString(), // TODO implement last active time
    };
    this.lastMessage = undefined;
    this.unreadCount = 0;
  }
}
