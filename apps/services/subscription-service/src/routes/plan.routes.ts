import {FastifyInstance} from 'fastify';
import {container} from '@/config/inversify.config';
import {TYPES} from '@/types';
import {PlanController} from "@/controllers/plan.controller";

const planController = container.get<PlanController>(TYPES.PlanController);

export function planRoutes(fastify: FastifyInstance) {
    fastify.get('/plan/:id',
        async (request, reply) => {
            try {
                const planId = (request.params as { id?: string }).id

                if (!planId) {
                    return reply.status(400).send({error: 'planId is required'});
                }

                const plan = await planController.getPlanDetails(planId);

                if (!plan) {
                    return reply.status(404).send({error: 'Plan not found'});
                }

                return reply.status(200).send(plan);
            } catch (error) {
                console.log('Error fetching plan:', error);
                request.log.error(error);
                return reply.status(500).send({error: 'Failed to fetch plan'});
            }
        }
    )
}
