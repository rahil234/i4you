import { connectDB } from '@/config/db.config';
import { kafkaClient } from '@/events/kafka/kafka';
import { initMatchListener } from '@/events/kafka/match.listener';

export const initLoaders = async () => {
  await connectDB();

  await kafkaClient.connectProducer();
  await initMatchListener();
};
