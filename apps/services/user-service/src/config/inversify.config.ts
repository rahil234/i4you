import { Container } from 'inversify';

import { TYPES } from '@/types';
import { UserService } from '@/services/user.service';
import { MediaService } from '@/services/media.service';
import { CacheService } from '@/services/cache.service';
import { KafkaService } from '@/events/kafka/KafkaService';
import { UserController } from '@/controllers/user.controller';
import { IUserService } from '@/services/interfaces/IUserService';
import { IMediaService } from '@/services/interfaces/IMediaService';
import { ICacheService } from '@/services/interfaces/ICacheService';
import { MongoUserRepository } from '@/repositories/user.repository';
import { MongoAdminRepository } from '@/repositories/admin.repository';
import { IKafkaService } from '@/events/kafka/interfaces/IKafkaService';
import { IUserRepository } from '@/repositories/interfaces/IUserRepository';
import { IAdminRepository } from '@/repositories/interfaces/IAdminRepository';
import { HttpSubscriptionService } from '@/services/http-subscription.service';
import { ISubscriptionService } from '@/services/interfaces/ISubscriptionService';

export const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository);

container
  .bind<IAdminRepository>(TYPES.AdminRepository)
  .to(MongoAdminRepository);

container.bind<IUserService>(TYPES.UserService).to(UserService);

container
  .bind<ISubscriptionService>(TYPES.SubscriptionService)
  .to(HttpSubscriptionService);

container.bind<IMediaService>(TYPES.MediaService).to(MediaService);

container.bind<ICacheService>(TYPES.CacheService).to(CacheService);

container
  .bind<IKafkaService>(TYPES.KafkaService)
  .toConstantValue(new KafkaService());

container.bind<UserController>(TYPES.UserController).to(UserController);
