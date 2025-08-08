import { injectable } from 'inversify';
import { stripe } from '@/config/stripe.config';
import { handleAsync } from '@/utils/handle-async';

@injectable()
export class StripeController {
  createCheckoutSession = handleAsync(async (req, reply) => {
    // const { userId, priceId } = req.body as { userId: string, priceId: string };

    const { userId, priceId } = { userId: 'user123', priceId: 'price_1RtKwUC2pYUroNBIdOBXL1rB' };

    console.log(`Creating checkout session for user ${userId} with price ID ${priceId}`);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'https://i4you.local.net/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://i4you.local.net/payment/cancel',
      metadata: {
        userId,
      },
    });

    return reply.send({ url: session.url });
  });

  getSessionDetails = handleAsync(async (req, reply) => {
    const sessionId = (req.params as { sessionId: string }).sessionId;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['customer', 'subscription'],
      });

      return reply.send({
        id: session.id,
        customer: session.customer,
        subscription: session.subscription,
        amount_total: session.amount_total,
        status: session.status,
      });
    } catch (error) {
      console.error('Error retrieving session:', error);
      return reply.status(400).send({ message: 'Invalid session ID' });
    }
  });
}
