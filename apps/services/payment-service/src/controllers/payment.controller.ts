import {inject, injectable} from 'inversify';
import {handleAsync} from '@/utils/handle-async';
import {TYPES} from '@/types';
import {IPaymentService} from "@/services/interfaces/IPaymentService.ts";
import {ISubscriptionService} from "@/services/interfaces/ISubscriptionService";

@injectable()
export class PaymentController {
    constructor(
        @inject(TYPES.PaymentService) private _paymentService: IPaymentService,
        @inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService
    ) {
    }

    createCheckoutSession = handleAsync(async (req, reply) => {
        const userId = req.user?.id!;

        const planId = (req.body as { planId?: string }).planId;

        if (!planId) {
            return reply.status(400).send({message: 'Plan ID is required'});
        }

        const plan = await this._subscriptionService.getPlanDetails(planId);

        if (!plan) {
            return reply.status(404).send({message: 'Plan not found'});
        }

        const priceId = plan.stripe.price_id;

        const session = await this._paymentService.createCheckoutSession({userId, priceId, planId});
        return reply.send(session);
    });

    getSessionDetails = handleAsync(async (req, reply) => {
        const sessionId = (req.params as { sessionId: string }).sessionId;
        const session = await this._paymentService.getSessionDetails(sessionId);
        return reply.send(session);
    });
}
