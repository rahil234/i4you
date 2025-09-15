import {FastifyInstance} from 'fastify';
import {container} from '@/config/inversify.config';
import {TYPES} from '@/types';
import {SubscriptionController} from "@/controllers/subscription.controller";

const subscriptionController = container.get<SubscriptionController>(TYPES.SubscriptionController);

export function subscriptionRoutes(fastify: FastifyInstance) {
    fastify.post('/subscriptions',
        async (request, reply) => {
            try {
                const {planId, userId} = request.body as { planId: string, userId: string };

                if (!planId || !userId) {
                    console.log('Invalid request body:', request.body, planId, userId);
                    return reply.status(400).send({error: 'planId is required'});
                }

                const subscription = await subscriptionController.createSubscription(userId, planId);
                return reply.status(201).send(subscription);
            } catch (error) {
                console.log('Error creating subscription:', error);
                request.log.error(error);
                return reply.status(500).send({error: 'Failed to create subscription'});
            }
        }
    )
    ;

    fastify.get('/subscriptions/:id', async (request, reply) => {
        const {id} = request.params as { id: string };

        try {
            const subscription = await subscriptionController.getActiveSubscription(id);
            if (!subscription) {
                return reply.status(404).send({error: 'Subscription not found'});
            }
            return reply.send(subscription);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({error: 'Failed to retrieve subscription'});
        }
    });

    fastify.get('/users/:userId/subscriptions', {
        preHandler: fastify.authenticateAndAuthorize(['member', 'admin']),
    }, async (request, reply) => {
        const {userId} = request.params as { userId: string };

        try {
            const subscriptions = await subscriptionController.listUserSubscriptions(userId);
            return reply.send(subscriptions);
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({error: 'Failed to list subscriptions'});
        }
    });
}
