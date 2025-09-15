import {FastifyInstance} from 'fastify';
import {container} from '@/config/inversify.config';
import {TYPES} from '@/types';
import {PaymentController} from '@/controllers/payment.controller';


const stripeController = container.get<PaymentController>(TYPES.PaymentController);

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
    fastify.post('/stripe/session',
        {
            preHandler: fastify.authenticateAndAuthorize(['member'])
        },
        stripeController.createCheckoutSession);

    /**
     * @swagger
     * /api/v1/payment/session/{sessionId}:
     *   get:
     *     summary: Get user by token
     *     tags:
     *       - User
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: sessionId
     *         required: true
     *         schema:
     *           type: string
     *         description: The session ID
     *     responses:
     *       200:
     *         description: Login successful
     */
    fastify.get('/session/:sessionId', {
            preHandler: fastify.authenticateAndAuthorize(['member'])
        },
        stripeController.getSessionDetails
    );
}
