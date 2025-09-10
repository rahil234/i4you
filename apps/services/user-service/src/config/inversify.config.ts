import { Container } from 'inversify';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { MongoUserRepository } from '@/repositories/user.repository';
import { UserService } from '@/services/user.service';
import { TYPES } from '@/types';
import { UserController } from '@/controllers/user.controller';
import { MongoAdminRepository } from '@/repositories/admin.repository';
import { IAdminRepository } from '@/repositories/interfaces/IAdminRepository';
import { CacheService } from '@/services/cache.service';
import ICacheService from '@/services/interfaces/ICacheService';
import { KafkaService } from '@/events/kafka/KafkaService';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { MediaService } from '@/services/media.service';
import { IUserService } from '@/services/interfaces/IUserService';
import IMediaService from '@/services/interfaces/IMediaService';

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository);
container
  .bind<IAdminRepository>(TYPES.AdminRepository)
  .to(MongoAdminRepository);

container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IMediaService>(TYPES.MediaService).to(MediaService);
container.bind<ICacheService>(TYPES.CacheService).to(CacheService);
container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

container.bind<UserController>(TYPES.UserController).to(UserController);

export { container };
