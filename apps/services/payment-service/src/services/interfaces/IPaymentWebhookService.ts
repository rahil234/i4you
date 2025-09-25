import Stripe from 'stripe';

export interface IPaymentWebhookService {
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
}
