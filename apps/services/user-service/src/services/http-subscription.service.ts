import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';

export class HttpSubscriptionService implements ISubscriptionService {
  async getUserSubscription(
    userId: string
  ): Promise<{ planId: string; status: string }> {
    const res = await fetch(
      'http://subscription-service:4010/subscriptions/' + userId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      return { planId: 'basic', status: 'inactive' };
    }

    const sub = await res.json();

    console.log('sub from http service:', sub);
    return {
      planId: sub.planId,
      status: sub.status,
    };
  }
}
