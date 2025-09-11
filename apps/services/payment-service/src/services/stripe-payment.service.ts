import {
  CheckoutSessionPayload,
  CheckoutSessionResponse,
  IPaymentService, SessionDetails,
} from '@/services/interfaces/IPaymentService';
import { stripe } from '@/config/stripe.config';

export class StripePaymentService implements IPaymentService {
  async createCheckoutSession(payload: CheckoutSessionPayload): Promise<CheckoutSessionResponse> {
    const { userId, priceId } = payload;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'], // keep provider specific
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'https://i4you.local.net/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://i4you.local.net/payment/cancel',
      metadata: { userId },
    });

    return { url: session.url! };
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
