import { Container } from 'inversify';
import { MatchService } from '@/services/match.service';
import { TYPES } from '@/types';
import { MatchController } from '@/controllers/match.controller';
import { KafkaService } from '@/events/kafka/kafka.service';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { IMatchRepository } from '@/repositories/interfaces/IMatchRepository';
import { MatchRepository } from '@/repositories/match.repository';
import { UserGrpcService } from '@/services/user.grpc.service';
import { UserGrpcProvider } from '@/providers/user.grpc.provider';
import { DiscoveryGrpcService } from '@/services/discovery.grpc.service';
import { DiscoveryGrpcProvider } from '@/providers/discovery.grpc.provider';
import { MediaService } from '@/services/media.service';
import { IMediaService } from '@/services/interfaces/IMediaService';
import { IMatchService } from '@/services/interfaces/IMatchService';
import { IUserService } from '@/services/interfaces/IUserService';
import { IDiscoveryService } from '@/services/interfaces/IDiscoveryService';
import { IInteractionService } from '@/services/interfaces/IInteractionService';
import { GRPCInteractionService } from '@/services/interaction.grpc.service';
import { InteractionGrpcProvider } from '@/providers/interaction.grpc.provider';

const container = new Container();

container.bind<MatchController>(TYPES.MatchController).to(MatchController);

container.bind<IMatchRepository>(TYPES.MatchRepository).to(MatchRepository);

container.bind<IMatchService>(TYPES.MatchService).to(MatchService);
container
  .bind<IInteractionService>(TYPES.InteractionService)
  .to(GRPCInteractionService);
container.bind<IMediaService>(TYPES.MediaService).to(MediaService);

container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

container.bind<IUserService>(TYPES.UserGrpcService).to(UserGrpcService);

container
  .bind<IDiscoveryService>(TYPES.DiscoveryGrpcService)
  .to(DiscoveryGrpcService);

container
  .bind<UserGrpcProvider>(TYPES.UserGrpcProvider)
  .to(UserGrpcProvider)
  .inSingletonScope();

container
  .bind<DiscoveryGrpcProvider>(TYPES.DiscoveryGrpcProvider)
  .to(DiscoveryGrpcProvider)
  .inSingletonScope();

container
  .bind<InteractionGrpcProvider>(TYPES.InteractionGrpcProvider)
  .to(InteractionGrpcProvider)
  .inSingletonScope();

export { container };
