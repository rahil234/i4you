import { kafkaClient } from '@/events/kafka/kafka';
import { container } from '@/config/inversify.config';
import { UserService } from '@/services/user.service';
import { TYPES } from '@/types';

const userService = container.get<UserService>(TYPES.UserService);

export const initKafkaConsumer = async () => {
  const consumer = kafkaClient.consumer;

  await consumer.connect();
  await consumer.subscribe({ topic: 'match.events', fromBeginning: false });

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
