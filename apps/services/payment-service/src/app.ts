import { stripeRoutes } from '@/routes/stripe.routes';
import { StripeWebhook } from './webhooks/stripe.webhook';
import Fastify from 'fastify';
import { env } from '@/config';

const app = Fastify({ logger: true });

app.register(stripeRoutes);

app.register(StripeWebhook)

app.listen({ port: Number(env.PORT), host: '0.0.0.0' }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Payment Service is running on port ${env.PORT}`);
});
