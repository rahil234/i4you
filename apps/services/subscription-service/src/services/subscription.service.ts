import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';
import { ISubscriptionRepository } from '@/repositories/interfaces/ISubscriptionRepository';
import {
  CreateSubscriptionPayload,
  CreateSubscriptionResponse,
  SubscriptionDetails,
  TYPES,
} from '@/types';
import { inject } from 'inversify';
import { IPlanService } from '@/services/interfaces/IPlanService';

export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.PlanService) private _planService: IPlanService,
  ) {}

  async createSubscription(
    payload: CreateSubscriptionPayload,
  ): Promise<CreateSubscriptionResponse> {
    const plan = await this._planService.getPlanDetails(payload.planId);
    if (!plan) throw new Error('Invalid plan');

    const activeSub = await this._subscriptionRepository.findActiveByUserId(
      payload.userId,
    );
    if (activeSub) {
      activeSub.status = 'canceled';
      activeSub.currentPeriodEnd = new Date();
      await this._subscriptionRepository.update(activeSub.id, activeSub);
    }

    const subscription = await this._subscriptionRepository.create({
      userId: payload.userId,
      planId: payload.planId,
      tier: plan.tier,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: new Date(
        new Date().setMonth(new Date().getMonth() + 1),
      ),
      status: 'active',
    });

    return {
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    };
  }

  async getSubscriptionDetails(
    subscriptionId: string,
  ): Promise<SubscriptionDetails | null> {
    const sub = await this._subscriptionRepository.findById(subscriptionId);
    if (!sub) return null;

    const plan = await this._planService.getPlanDetails(sub.planId);
    return {
      id: sub.id,
      userId: sub.userId,
      status: sub.status,
      tier: plan?.tier!,
      planName: plan?.name!,
      features: plan?.features!,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      startDate: sub.startedAt,
      planId: sub.planId,
      currentPeriodEnd: sub.currentPeriodEnd,
    };
  }

  async getActiveSubscriptionByUserId(
    userId: string,
  ): Promise<SubscriptionDetails | null> {
    const sub = await this._subscriptionRepository.findActiveByUserId(userId);

    if (!sub) return null;

    const plan = await this._planService.getPlanDetails(sub.planId);

    return {
      id: sub.id,
      userId: sub.userId,
      tier: sub.tier,
      status: sub.status,
      planName: plan?.name!,
      features: plan?.features!,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      startDate: sub.startedAt,
      planId: sub.planId,
      currentPeriodEnd: sub.currentPeriodEnd,
    };
  }

  async listUserSubscriptions(userId: string): Promise<SubscriptionDetails[]> {
    const subs = await this._subscriptionRepository.findByUserId(userId);

    const results: SubscriptionDetails[] = [];

    if (subs && subs.length !== 0) {
      for (const sub of subs) {
        const plan = await this._planService.getPlanDetails(sub.planId);
        results.push({
          id: sub.id,
          userId: sub.userId,
          tier: plan?.tier!,
          status: sub.status,
          planName: plan?.name!,
          features: plan?.features!,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          startDate: sub.startedAt,
          planId: sub.planId,
          currentPeriodEnd: sub.currentPeriodEnd,
        });
      }
    }

    return results;
  }

  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd = true,
  ): Promise<SubscriptionDetails | null> {
    const sub = await this._subscriptionRepository.findById(subscriptionId);
    if (!sub) return null;

    if (cancelAtPeriodEnd) {
      sub.cancelAtPeriodEnd = true;
    } else {
      sub.status = 'canceled';
      sub.currentPeriodEnd = new Date();
    }

    const updatedSub = await this._subscriptionRepository.update(
      subscriptionId,
      sub,
    );

    if (!updatedSub) return null;

    const plan = await this._planService.getPlanDetails(updatedSub.planId);

    return {
      id: updatedSub.id,
      userId: updatedSub.userId,
      status: updatedSub.status,
      tier: plan?.tier!,
      planName: plan?.planName!,
      features: plan?.features!,
      cancelAtPeriodEnd: updatedSub.cancelAtPeriodEnd,
      startDate: updatedSub.startedAt,
      planId: updatedSub.planId,
      currentPeriodEnd: updatedSub.currentPeriodEnd,
    };
  }
}
