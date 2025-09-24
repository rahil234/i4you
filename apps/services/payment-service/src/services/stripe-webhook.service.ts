import {IPaymentWebhookService} from "@/services/interfaces/IPaymentWebhookService";
import Stripe from "stripe";
import {TYPES} from "@/types";
import {inject} from "inversify";
import {ISubscriptionService} from "@/services/interfaces/ISubscriptionService";

export class StripePaymentWebhookService implements IPaymentWebhookService {
    constructor(@inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService) {
    }

    private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (!userId || !planId) {
            console.error('Missing userId or planId in session metadata');
            throw new Error('Missing userId or planId in session metadata');
        }

        await this._subscriptionService.releaseLock(userId);

        await this._subscriptionService.createSubscription(userId, planId);
    }

    async handleWebhookEvent(event: Stripe.Event): Promise<void> {
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
}
