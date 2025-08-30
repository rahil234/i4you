import { kafkaClient } from '@/events/kafka/kafka';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { IInteractionService } from '@/services/interfaces/IInteractionService';

const interactionService = container.get<IInteractionService>(
  TYPES.InteractionService
);

export const initMatchListener = async () => {
  await kafkaClient.connectConsumer([
    { topic: 'match.events', fromBeginning: false },
  ]);
  await kafkaClient.runConsumer(async ({ key, value }) => {
    const payload = JSON.parse(value || '{}');
    if (key === 'match_found') {
      await interactionService.createInteraction(payload.user1);
    }
  });
};
