import { PlanDetails } from '@/types';

export interface ISubscriptionService {
  createSubscription(userId: string, planId: string): Promise<void>;

  getPlanDetails(planId: string): Promise<PlanDetails | null>;

  acquireLock(userId: string): Promise<boolean>;

  releaseLock(userId: string): Promise<void>;
}
