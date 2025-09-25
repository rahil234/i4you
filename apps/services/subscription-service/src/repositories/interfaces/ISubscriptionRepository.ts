import { Subscription } from '@/entities/subscription.entity';

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;

  findByUserId(userId: string): Promise<Subscription[] | null>;

  findActiveByUserId(userId: string): Promise<Subscription | null>;

  create(data: Omit<Subscription, 'id' | 'startedAt'>): Promise<Subscription>;

  update(id: string, data: Partial<Subscription>): Promise<Subscription | null>;

  activateSubscription(id: string): Promise<Subscription | null>;

  cancelSubscription(
    id: string,
    cancelAtPeriodEnd?: boolean,
  ): Promise<Subscription | null>;

  expireSubscription(id: string): Promise<Subscription | null>;

  listByUser(userId: string): Promise<Subscription[]>;
}
