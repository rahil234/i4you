import { subscriptionRoutes } from '@/routes/subscription.routes';
import Fastify from 'fastify';
import authenticateAndAuthorize from '@/plugins/authenticate-and-authorize.middleware';
import { planRoutes } from '@/routes/plan.routes';

export const createApp = () => {
  const app = Fastify({ logger: true });

  app.register(authenticateAndAuthorize);

  app.register(subscriptionRoutes);

  app.register(planRoutes);

  return app;
};
