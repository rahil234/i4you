import express from 'express';

import { env } from '@/config/index';
import userRoutes from '@/routes/user.routes';
import { connectDB } from '@/config/db.config';
import setupSwaggerDocs, { swaggerSpec } from '@/config/swagger.config';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';
import { requestLogger } from '@/middlwares/request-logger.middleware';
import { connectRedis } from '@/config/redis.config';
import { KafkaService } from '@/events/kafka/KafkaService';
import { container } from '@/config/inversify.config';
import { UserService } from '@/services/user.service';
import { TYPES } from '@/types';
import { startKafkaListener } from '@/events/kafka/start-consumer';

const kafkaService = container.get<KafkaService>(TYPES.KafkaService);

const app = express();

app.use(express.json());

app.use(requestLogger());

app.get('/api-docs-json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/health', (_req, res) => {
  res.send('User Service is up and running');
});

app.use('/', userRoutes);

setupSwaggerDocs(app);

app.use(errorHandlerMiddleware);

const startServer = async () => {
  await connectDB();
  await connectRedis();
  startKafkaListener().catch((err) => {
    console.error('Failed to start Kafka listener:', err);
  });
  await kafkaService
    .connect()
    .then(() => console.log('Kafka Producer connected successfully'));
  app.listen(env.PORT, () => {
    console.log('User Server running on port ', env.PORT);
  });
};

// noinspection JSIgnoredPromiseFromCall
startServer();
