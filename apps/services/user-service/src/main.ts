import app from '@/app';
import { env } from '@/config/index';
import { connectDB } from '@/config/db.config';
import { connectRedis } from '@/config/redis.config';

import { TYPES } from '@/types';
import { container } from '@/config/inversify.config';
import { KafkaService } from '@/events/kafka/KafkaService';
import { initKafkaConsumer } from '@/events/kafka/consumer';

const kafkaService = container.get<KafkaService>(TYPES.KafkaService);

const startServer = async () => {
  await connectDB();
  await connectRedis();
  initKafkaConsumer().catch((err) => {
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
