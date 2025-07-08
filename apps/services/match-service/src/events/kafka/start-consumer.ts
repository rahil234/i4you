import { consumer, initKafkaConsumer } from './consumer';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { MatchService } from '@/services/match.service';

export const startKafkaListener = async () => {
  const matchService = container.get<MatchService>(TYPES.MatchService);

  await initKafkaConsumer();

  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key?.toString();
      const payload = JSON.parse(message.value?.toString() || '{}');

      if (key === 'user_liked') {
        await matchService.handleLike(payload.userId, payload.likedUserId);
      }
    },
  });

  console.log('Kafka listener is running...');
};
