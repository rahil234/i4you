import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { NotificationsGateway } from '../gateway/notifications.gateway';

interface MatchEventPayload {
  userId: string;
  matchedUserId: string;
  name: string;
  photo: string;
  timestamp: Date;
}

@Controller()
export class NotificationListener {
  constructor(private readonly gateway: NotificationsGateway) {}

  @EventPattern('notification.events')
  handleMatchEvent(
    @Payload() payload: MatchEventPayload,
    @Ctx() context: KafkaContext,
  ) {
    const topic = context.getTopic();
    const key = (context.getMessage().key || 'null').toString();
    const partition = context.getPartition();

    console.log(
      `📩 Received Event on topic: ${topic} | partition: ${partition} | key: ${key}`,
    );

    console.log('Payload:', payload);

    this.gateway.emitToUser(payload.userId, 'match', payload);
  }
}
