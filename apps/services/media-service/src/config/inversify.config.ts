import { Container } from 'inversify';
import { TYPES } from '@/types';
import { UserGrpcService } from '@/services/user.grpc.service';
import { GrpcClientProvider } from '@/grpc/user.client';
import { MediaController } from '@/controllers/media.controller';

const container = new Container();

container.bind<UserGrpcService>(TYPES.UserGrpcService).to(UserGrpcService);
container.bind<MediaController>(TYPES.MediaController).to(MediaController);
container
  .bind<GrpcClientProvider>(TYPES.GrpcClientProvider)
  .to(GrpcClientProvider);

export { container };
