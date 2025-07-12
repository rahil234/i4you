import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from '../gateway/notifications.gateway';

interface MatchEventPayload {
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
}
