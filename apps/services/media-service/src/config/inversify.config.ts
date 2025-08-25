import { Container } from 'inversify';
import { TYPES } from '@/types';
import { MediaController } from '@/controllers/media.controller';
import { MediaService } from '@/services/media.service';
import { CacheService } from '@/services/cache.service';

const container = new Container();

container.bind<MediaController>(TYPES.MediaController).to(MediaController);
container.bind<MediaService>(TYPES.MediaService).to(MediaService);
container.bind<CacheService>(TYPES.CacheService).to(CacheService);

export { container };
