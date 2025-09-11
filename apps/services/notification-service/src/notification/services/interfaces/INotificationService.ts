import type { PushSubscription } from 'web-push';

export interface INotificationsService {
  getAllSubscription(): Promise<PushSubscription[]>;

  subscribe(userId: string, sub: PushSubscription): Promise<void>;

  unsubscribe(sub: PushSubscription): Promise<void>;

  getSubscriptionByUserId(userId: string): Promise<PushSubscription | null>;

  sendNotification(
    subscription: PushSubscription,
    payload: string,
  ): Promise<void>;
}
