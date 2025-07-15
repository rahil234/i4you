import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from '../gateway/notifications.gateway';

interface MatchEventPayload {
  type: 'NEW_CHAT' | 'NEW_MESSAGE';
  recipientId: string;
  data: {
    userId: string;
    matchedUserId: string;
    name: string;
    photo: string;
    timestamp: Date;
  };
}

@Controller()
export class NotificationListener {
  constructor(private readonly gateway: NotificationsGateway) {}

  @EventPattern('notification.events')
  async handleMatchEvent(@Payload() payload: MatchEventPayload) {
    await this.gateway.emitToUser(payload.recipientId, 'match', payload.data);
  }

  @EventPattern('chat.events')
  async handleChatEvent(@Payload() payload: MatchEventPayload) {
    console.log('Received chat event:', payload);

    if (!payload.recipientId) {
      console.error('No recipientId provided in payload:', payload);
      return;
    }

    switch (payload.type) {
      case 'NEW_CHAT':
        console.log('Handling new chat event:', payload);
        await this.gateway.emitToUser(
          payload.recipientId,
          'chat',
          payload.data,
        );
        break;
      case 'NEW_MESSAGE':
        console.log('Handling new message event:', payload);
        await this.gateway.emitToUser(
          payload.recipientId,
          'message',
          payload.data,
        );
        break;
      default:
        console.error('Unknown event type:', payload.type);
        return;
    }
  }
}
