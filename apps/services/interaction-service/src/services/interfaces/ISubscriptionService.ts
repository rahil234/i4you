export interface ISubscriptionService {
  getUserSubscription(
    userId: string
  ): Promise<{ planId: 'free' | 'plus' | 'premium' }>;
}
