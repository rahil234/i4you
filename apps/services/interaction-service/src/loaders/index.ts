import { connectDB } from '@/config/db.config';
import { kafkaClient } from '@/events/kafka/kafka';
import { startGrpcServer } from '@/config/grpc.server';

export const initLoaders = async () => {
  await connectDB();

  startGrpcServer();

  await kafkaClient.connectProducer();
};
