import { consumer, initKafkaConsumer } from './consumer';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { UserService } from '@/services/user.service';

export const startKafkaListener = async () => {
  const userService = container.get<UserService>(TYPES.UserService);

  await initKafkaConsumer();

  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key?.toString();
      const payload = JSON.parse(message.value?.toString() || '{}');

      if (key === 'match_found') {
        await userService.userMatched(payload.user1, payload.user2);
      }
    },
  });

  console.log('Kafka listener is running...');
};
