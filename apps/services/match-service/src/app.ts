import express from 'express';

import { env } from '@/config/index';
import { connectDB } from '@/config/db.config';
import setupSwaggerDocs, { swaggerSpec } from '@/config/swagger.config';
import { errorHandlerMiddleware } from '@/middlwares/error-handler.middleware';
import { requestLogger } from '@/middlwares/request-logger.middleware';
import { startKafkaListener } from './events/kafka/start-consumer';
import { container } from './config/inversify.config';
import { KafkaService } from '@/events/kafka/KafkaService';
import { TYPES } from '@/types';
import matchRoutes from '@/routes/match.routes';

const app = express();

const kafkaService = container.get<KafkaService>(TYPES.KafkaService);

app.use(express.json());

app.use(requestLogger());

app.get('/api-docs-json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/health', (_req, res) => {
  res.send('User Service is up and running');
});

app.use('/', matchRoutes);

setupSwaggerDocs(app);

app.use(errorHandlerMiddleware);

const startServer = async () => {
  await connectDB();
  startKafkaListener().catch((err) => {
    console.error('Failed to start Kafka listener:', err);
  });
  await kafkaService.connect().then(() => {
    console.log('Kafka Producer connected successfully');
    //   setInterval(() => {
    //     kafkaService.emit('match.events', 'match_found', {
    //       user1: '12345',
    //       user2: '67890',
    //       matchId: 'match12345',
    //       timestamp: new Date().toISOString(),
    //     });
    //     console.log('Emitted match event to Kafka');
    //   }, 5000);
  });
  app.listen(env.PORT, () => {
    console.log('Match Server running on port ', env.PORT);
  });
};

// noinspection JSIgnoredPromiseFromCall
startServer();
