import { Container } from 'inversify';
import { TYPES } from '@/types';
import { MediaController } from '@/controllers/media.controller';

const container = new Container();

container.bind<MediaController>(TYPES.MediaController).to(MediaController);

export { container };
