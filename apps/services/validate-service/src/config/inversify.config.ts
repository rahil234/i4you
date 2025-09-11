import { Container } from 'inversify';
import { RedisService } from '@/services/redis.service';
import { ICacheService } from '@/services/interfaces/ICacheService';
import { TYPES } from '@/types';
import { ValidateController } from '@/controllers/validate.controller';
import { IUserService } from '@/services/interfaces/IUserService';
import { UserService } from '@/services/user.service';

const container = new Container();

container.bind<ICacheService>(TYPES.CacheService).to(RedisService);
container
  .bind<ValidateController>(TYPES.ValidateController)
  .to(ValidateController);
container.bind<IUserService>(TYPES.UserService).to(UserService);

export { container };
