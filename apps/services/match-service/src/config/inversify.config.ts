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
import { UserGrpcProvider } from '@/providers/user.grpc.provider';
import { DiscoveryGrpcService } from '@/services/discovery.grpc.service';
import { DiscoveryGrpcProvider } from '@/providers/discovery.grpc.provider';
import { MediaService } from '@/services/media.service';

const container = new Container();

container.bind<IMatchRepository>(TYPES.MatchRepository).to(MatchRepository);
container.bind<ILikeRepository>(TYPES.LikeRepository).to(LikeRepository);
container.bind<MatchService>(TYPES.MatchService).to(MatchService);
container.bind<MediaService>(TYPES.MediaService).to(MediaService);
container.bind<MatchController>(TYPES.MatchController).to(MatchController);

container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

container.bind<UserGrpcService>(TYPES.UserGrpcService).to(UserGrpcService);

container
  .bind<DiscoveryGrpcService>(TYPES.DiscoveryGrpcService)
  .to(DiscoveryGrpcService);

container
  .bind<UserGrpcProvider>(TYPES.UserGrpcProvider)
  .to(UserGrpcProvider)
  .inSingletonScope();

container
  .bind<DiscoveryGrpcProvider>(TYPES.DiscoveryGrpcProvider)
  .to(DiscoveryGrpcProvider)
  .inSingletonScope();

export { container };
