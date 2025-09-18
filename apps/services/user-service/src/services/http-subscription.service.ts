import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';

export class HttpSubscriptionService implements ISubscriptionService {
  async getUserSubscription(
    userId: string
  ): Promise<{ planId: 'free' | 'plus' | 'premium'; status: string }> {
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
      return { planId: 'free', status: 'inactive' };
    }

    const sub = await res.json();

    return {
      planId: sub.planId,
      status: sub.status,
    };
  }
}
