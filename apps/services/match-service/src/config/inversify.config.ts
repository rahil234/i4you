import { Container } from 'inversify';
import { MatchService } from '@/services/match.service';
import { TYPES } from '@/types';
import { MatchController } from '@/controllers/match.controller';
import { KafkaService } from '@/events/kafka/KafkaService';
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';
import IMatchRepository from '@/repositories/interfaces/IMatchRepository';
import { MatchRepository } from '@/repositories/match.repository';

const container = new Container();

container.bind<IMatchRepository>(TYPES.MatchRepository).to(MatchRepository);
container.bind<MatchService>(TYPES.MatchService).to(MatchService);
container.bind<MatchController>(TYPES.MatchController).to(MatchController);

container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

export { container };
