import { connectDB } from '@/config/db.config';
import { kafkaClient } from '@/events/kafka/kafka';
import { startGrpcServer } from '@/config/grpc.server';
import { connectRedis } from '@/config/redis.config';

export const initLoaders = async () => {
  await connectDB();
  await connectRedis();

  startGrpcServer();

  await kafkaClient.connectProducer();
};
