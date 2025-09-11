import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import type { PushSubscription } from 'web-push';
import { INotificationsService } from './interfaces/INotificationService';

@Injectable()
export class NotificationsService implements INotificationsService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getAllSubscription(): Promise<PushSubscription[]> {
    const keys = await this.redis.keys('subscription:*');
    const subscriptions: PushSubscription[] = [];
    for (const key of keys) {
      const subscriptionData = JSON.parse(
        (await this.redis.get(key)) || '{}',
      ) as PushSubscription;
      if (subscriptionData) {
        subscriptions.push(subscriptionData);
      }
    }
    return subscriptions;
  }

  async subscribe(userId: string, sub: PushSubscription): Promise<void> {
    const key = `subscription:${userId}`;
    const subscriptionData = JSON.stringify(sub);
    await this.redis.set(key, subscriptionData);
    console.log('Subscription saved:', sub);
  }

  async unsubscribe(sub: PushSubscription): Promise<void> {
    // This method can be used to handle unsubscription logic if needed
    console.log('Unsubscription received:', sub);
    return Promise.resolve();
  }

  async getSubscriptionByUserId(
    userId: string,
  ): Promise<PushSubscription | null> {
    const key = `subscription:${userId}`;
    const subscriptionData = await this.redis.get(key);
    if (subscriptionData) {
      return JSON.parse(subscriptionData) as PushSubscription;
    }
    return null;
  }

  async sendNotification(
    subscription: PushSubscription,
    payload: string,
  ): Promise<void> {
    // This method can be used to send notifications to the subscribed users using a push service or WebSocket.
    console.log('Sending notification to:', subscription);
    console.log('Payload:', payload);
    return Promise.resolve();
  }
}
