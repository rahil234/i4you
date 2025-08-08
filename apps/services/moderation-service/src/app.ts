import fastify from 'fastify';
import { env } from '@/config';
import { moderationRoutes } from '@/routes/moderation.route';

const app = fastify({ logger: true });

app.register(moderationRoutes);

app.listen({ port: Number(env.PORT), host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${address}`);
});
