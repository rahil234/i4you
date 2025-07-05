import { Container } from 'inversify';
import IUserRepository from '@/repositories/interfaces/IUserRepository';
import { UserRepository } from '@/repositories/user.repository';
import { UserService } from '@/services/user.service';
import { TYPES } from '@/types';
import { UserController } from '@/controllers/user.controller';
import { UserGrpcService } from '@/services/grpc.user.service';
import { AdminRepository } from '@/repositories/admin.repository';
import IAdminRepository from '@/repositories/interfaces/IAdminRepository';
import { CacheService } from '@/services/cache.service';
import ICacheService from '@/services/interfaces/ICacheService';
import { KafkaService } from '@/events/kafka/KafkaService';
import IKafkaService from '@/events/interfaces/IKafkaService';

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<ICacheService>(TYPES.CacheService).to(CacheService);
container.bind<UserController>(TYPES.UserController).to(UserController);

container.bind<UserGrpcService>(TYPES.GrpcUserService).to(UserGrpcService);
container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

export { container };
