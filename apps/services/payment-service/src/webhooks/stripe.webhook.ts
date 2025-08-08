import { FastifyInstance } from 'fastify';
import { stripe } from '@/config/stripe.config';
import { env } from '@/config';
import Stripe from 'stripe';
import rawbody from '@/plugins/rawbody';

export function StripeWebhook(fastify: FastifyInstance) {
  fastify.register(rawbody);

  fastify.post('/webhook',
    async (req, reply) => {
      const sig = req.headers['stripe-signature']!;
      const rawBody = req.body as Buffer;

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error('Webhook error:', err);
        return reply.status(400).send(`Webhook Error: ${err.message}`);
      }

      switch (event.type) {
        case 'checkout.session.completed': {
          console.log('Checkout Session Completed:', event);
          const session = event.data.object as any;
          const userId = session.metadata?.userId;
          console.log(`✅ Payment Success for User ${userId}`);
          break;
        }
      }

      reply.status(200).send('Received');
    });
}
