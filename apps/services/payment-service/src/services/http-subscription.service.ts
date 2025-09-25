import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';
import { injectable } from 'inversify';
import { PlanDetails } from '@/types';

@injectable()
export class HttpSubscriptionService implements ISubscriptionService {
  async createSubscription(userId: string, planId: string): Promise<void> {
    await fetch('http://subscription-service:4010/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, userId }),
    });
  }

  async getPlanDetails(planId: string): Promise<PlanDetails> {
    const res = await fetch(`http://subscription-service:4010/plan/${planId}`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch plan details');
    }

    return (await res.json()) as PlanDetails;
  }

  /**
   * Try to acquire a subscription lock for a user.
   * Returns true if lock acquired, false if already locked.
   */
  async acquireLock(userId: string): Promise<boolean> {
    const res = await fetch(
      `http://subscription-service:4010/subscriptions/lock?userId=${userId}`,
      {
        method: 'POST',
      },
    );

    if (res.status === 409) {
      return false;
    }

    if (!res.ok) {
      throw new Error('Failed to acquire subscription lock');
    }

    return true;
  }

  /**
   * Try to release a subscription lock for a user.
   * Returns true if lock acquired, false if already locked.
   */
  async releaseLock(userId: string): Promise<void> {
    const res = await fetch(
      `http://subscription-service:4010/subscriptions/lock?userId=${userId}`,
      {
        method: 'DELETE',
      },
    );

    if (!res.ok) {
      throw new Error('Failed to acquire subscription lock');
    }
  }
}
