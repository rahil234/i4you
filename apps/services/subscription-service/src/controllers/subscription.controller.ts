import {inject, injectable} from 'inversify';
import {TYPES} from '@/types';
import {ISubscriptionService} from "@/services/interfaces/ISubscriptionService";

@injectable()
export class SubscriptionController {
    constructor(@inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService) {
    }

    async createSubscription(userId: string, planId: string) {
        return this._subscriptionService.createSubscription({userId, planId});
    }

    async getActiveSubscription(subscriptionId: string) {
        return this._subscriptionService.getActiveSubscriptionByUserId(subscriptionId);
    }

    async getSubscriptionDetails(subscriptionId: string) {
        return this._subscriptionService.getSubscriptionDetails(subscriptionId);
    }

    async listUserSubscriptions(userId: string) {
        return this._subscriptionService.listUserSubscriptions(userId);
    }

    async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
        return this._subscriptionService.cancelSubscription(subscriptionId, cancelAtPeriodEnd);
    }
}
