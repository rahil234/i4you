import {
  CreateSubscriptionPayload,
  CreateSubscriptionResponse,
  SubscriptionDetails,
} from '@/types';

export interface ISubscriptionService {
  createSubscription(
    payload: CreateSubscriptionPayload,
  ): Promise<CreateSubscriptionResponse>;

  getSubscriptionDetails(
    subscriptionId: string,
  ): Promise<SubscriptionDetails | null>;

  listUserSubscriptions(userId: string): Promise<SubscriptionDetails[]>;

  getActiveSubscriptionByUserId(
    userId: string,
  ): Promise<SubscriptionDetails | null>;

  cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd?: boolean,
  ): Promise<SubscriptionDetails | null>;
}
