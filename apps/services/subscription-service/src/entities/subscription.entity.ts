export class Subscription {
  constructor(
    public id: string,
    public userId: string,
    public planId: string,
    public tier: 'free' | 'plus' | 'premium',
    public status: 'active' | 'canceled' | 'expired' | 'pending',
    public startedAt: Date,
    public currentPeriodEnd: Date,
    public cancelAtPeriodEnd: boolean = false,
  ) {}
}
