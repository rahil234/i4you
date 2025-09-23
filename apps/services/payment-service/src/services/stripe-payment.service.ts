import {stripe} from '@/config/stripe.config';
import {IPaymentService} from "@/services/interfaces/IPaymentService.ts";
import {CheckoutSessionPayload, CheckoutSessionResponse, SessionDetails} from "@/types";
import {env} from "@/config";

export class StripePaymentService implements IPaymentService {
    async createCheckoutSession(payload: CheckoutSessionPayload): Promise<CheckoutSessionResponse> {
        const {userId, priceId, planId} = payload;

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
