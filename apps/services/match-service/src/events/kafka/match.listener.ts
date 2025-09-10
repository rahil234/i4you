import { kafkaClient } from '@/events/kafka/kafka';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { MatchService } from '@/services/match.service';
import { EVENT_KEYS, EVENT_TOPICS } from '@/constants/events.constant';

const matchService = container.get<MatchService>(TYPES.MatchService);

export const initMatchListener = async () => {
  await kafkaClient.connectConsumer([
    { topic: EVENT_TOPICS.MATCH_EVENTS, fromBeginning: false },
  ]);
  await kafkaClient.runConsumer(async ({ key, value }) => {
    const payload = JSON.parse(value || '{}');
    if (key === EVENT_KEYS.USER_MATCHED) {
      await matchService.userMatched(payload.user1, payload.user2);
    }
  });
};
