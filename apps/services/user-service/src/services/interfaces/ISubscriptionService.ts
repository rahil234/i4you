export interface ISubscriptionService {
  getUserSubscription(
    userId: string
  ): Promise<{ planId: string; status: string }>;
}
