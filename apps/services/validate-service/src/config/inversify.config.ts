import { Container } from 'inversify';
import { CacheService } from '@/services/cache.service';
import ICacheService from '@/services/interfaces/ICacheService';
import { TYPES } from '@/types';
import { ValidateController } from '@/controllers/validate.controller';

const container = new Container();

container.bind<ICacheService>(TYPES.CacheService).to(CacheService);
container
  .bind<ValidateController>(TYPES.ValidateController)
  .to(ValidateController);

export { container };
