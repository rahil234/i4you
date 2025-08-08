import { FastifyInstance } from 'fastify';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { StripeController } from '@/controllers/stripe.controller';

const stripeController = container.get<StripeController>(TYPES.StripeController);

export function stripeRoutes(fastify: FastifyInstance) {
  /**
   * @swagger
   * /api/v1/payment/create-checkout-session:
   *   get:
   *     summary: Get user by token
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Login successful
   */
  fastify.post('/create-stripe-session', stripeController.createCheckoutSession);

  fastify.get('/session/:sessionId', stripeController.getSessionDetails);
}
