import {inject, injectable} from 'inversify';
import {TYPES} from '@/types';
import {ISubscriptionService} from "@/services/interfaces/ISubscriptionService";
import {FastifyReply, FastifyRequest} from "fastify";
import {ITransactionService} from "@/services/interfaces/ITransactionService";

@injectable()
export class SubscriptionController {
    constructor(
        @inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService,
        @inject(TYPES.TransactionService) private _transactionService: ITransactionService) {
    }

    async acquireLock(request: FastifyRequest, reply: FastifyReply) {
        const {userId} = request.query as { userId: string };
        console.log("Acquiring lock for userId:", userId);

        if (!userId) {
            return reply.status(400).send({error: "userId are required"});
        }

        const lock = await this._transactionService.acquireLock(userId)

        if (!lock) {
            return reply.status(409).send({error: "Subscription already in progress"});
        }

        return reply.send({ok: true});
    }

    async releaseLock(request: FastifyRequest, reply: FastifyReply) {
        const {userId} = request.query as { userId: string };

        if (!userId) {
            return reply.status(400).send({error: "userId are required"});
        }

        await this._transactionService.releaseLock(userId);

        return reply.send({ok: true});
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
