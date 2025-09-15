import { Container } from 'inversify';
import { IInteractionRepository } from '@/repositories/interfaces/IInteractionRepository';
import { MongoInteractionRepository } from '@/repositories/interaction.repository';
import { InteractionService } from '@/services/interaction.service';
import { TYPES } from '@/types';
import { InteractionController } from '@/controllers/interaction.controller';
import { KafkaService } from '@/events/kafka/KafkaService';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { IInteractionService } from '@/services/interfaces/IInteractionService';
import { ITokenRepository } from '@/repositories/interfaces/ITokenRepository';
import { RedisTokenRepository } from '@/repositories/token.repository';
import { ITokenService } from '@/services/interfaces/ITokenService';
import { TokenService } from '@/services/token.service';
import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';
import { HttpSubscriptionService } from '@/services/http-subscription.service';

export const container = new Container();

container
  .bind<IInteractionRepository>(TYPES.InteractionRepository)
  .to(MongoInteractionRepository);

container
  .bind<ITokenRepository>(TYPES.TokenRepository)
  .to(RedisTokenRepository);

container.bind<ITokenService>(TYPES.TokenService).to(TokenService);

container
  .bind<IInteractionService>(TYPES.InteractionService)
  .to(InteractionService);

container
  .bind<ISubscriptionService>(TYPES.SubscriptionService)
  .to(HttpSubscriptionService);

container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

container
  .bind<InteractionController>(TYPES.InteractionController)
  .to(InteractionController);
