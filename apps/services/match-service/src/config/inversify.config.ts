import { Container } from 'inversify';
import { MatchService } from '@/services/match.service';
import { TYPES } from '@/types';
import { MatchController } from '@/controllers/match.controller';
import { KafkaService } from '@/events/kafka/KafkaService';
import IKafkaService from '@/events/kafka/interfaces/IKafkaService';
import IMatchRepository from '@/repositories/interfaces/IMatchRepository';
import { MatchRepository } from '@/repositories/match.repository';
import ILikeRepository from '@/repositories/interfaces/ILikeRepository';
import { LikeRepository } from '@/repositories/like.repository';
import { UserGrpcService } from '@/services/user.grpc.service';
import { GrpcClientProvider } from '@/providers/grpc.client.provider';

const container = new Container();

container.bind<IMatchRepository>(TYPES.MatchRepository).to(MatchRepository);
container.bind<ILikeRepository>(TYPES.LikeRepository).to(LikeRepository);
container.bind<MatchService>(TYPES.MatchService).to(MatchService);
container.bind<MatchController>(TYPES.MatchController).to(MatchController);

container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

container.bind<UserGrpcService>(TYPES.UserGrpcService).to(UserGrpcService);
container
  .bind<GrpcClientProvider>(TYPES.GrpcClientProvider)
  .to(GrpcClientProvider)
  .inSingletonScope();

export { container };
