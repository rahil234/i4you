import {stripe} from '@/config/stripe.config';
import {IPaymentService} from "@/services/interfaces/IPaymentService.ts";
import {CheckoutSessionPayload, CheckoutSessionResponse, SessionDetails, TYPES} from "@/types";
import {env} from "@/config";
import {inject} from "inversify";
import {ISubscriptionService} from "@/services/interfaces/ISubscriptionService";
import {createError} from "@i4you/http-errors";

export class StripePaymentService implements IPaymentService {
    constructor(@inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService) {
    }

    async createCheckoutSession(payload: CheckoutSessionPayload): Promise<CheckoutSessionResponse> {
        const {userId, priceId, planId} = payload;

        const lock = await this._subscriptionService.acquireLock(userId);

        if (!lock) {
            createError.Conflict('Subscription process is already in progress. Please try again later.');
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env.FRONTEND_URL}/payment/cancel`,
            metadata: {userId, planId},
        });
        return {url: session.url!};
    }

    async getSessionDetails(sessionId: string): Promise<SessionDetails> {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['customer', 'subscription'],
        });

        return {
            id: session.id,
            customer: session.customer,
            subscription: session.subscription,
            amount_total: session.amount_total,
            status: session.status,
        };
    }
}
