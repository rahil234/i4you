import { Container } from 'inversify';
import { IInteractionRepository } from '@/repositories/interfaces/IInteractionRepository';
import { MongoInteractionRepository } from '@/repositories/interaction.repository';
import { InteractionService } from '@/services/interaction.service';
import { TYPES } from '@/types';
import { InteractionController } from '@/controllers/interaction.controller';
import { KafkaService } from '@/events/kafka/KafkaService';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { IInteractionService } from '@/services/interfaces/IInteractionService';

const container = new Container();

container
  .bind<IInteractionRepository>(TYPES.InteractionRepository)
  .to(MongoInteractionRepository);

container
  .bind<IInteractionService>(TYPES.InteractionService)
  .to(InteractionService);

container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

container
  .bind<InteractionController>(TYPES.InteractionController)
  .to(InteractionController);

export { container };
