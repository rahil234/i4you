import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';

export class HttpSubscriptionService implements ISubscriptionService {
  async getUserSubscription(
    userId: string
  ): Promise<{ planId: 'free' | 'plus' | 'premium' }> {
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
      return { planId: 'free' };
    }

    const sub = await res.json();

    console.log('sub from http service:', sub);
    return { planId: sub.planId };
  }
}
