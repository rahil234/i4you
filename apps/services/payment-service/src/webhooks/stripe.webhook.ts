import { FastifyInstance } from 'fastify';
import rawbody from '@/plugins/rawbody';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { StripeWebhookController } from '@/controllers/stripe-webhook.controller';

const stripeWebhookController = container.get<StripeWebhookController>(
  TYPES.StripeWebhookController,
);

export function StripeWebhook(fastify: FastifyInstance) {
  fastify.register(rawbody);

  fastify.post('/webhook/stripe', stripeWebhookController.handleWebhookEvent);
}
