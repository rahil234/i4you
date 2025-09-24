import { Container } from 'inversify';
import { TYPES } from '@/types';
import { ModerationService } from '@/services/moderation.service';
import { ModerationRepository } from '@/repositories/moderation.repository';
import { ModerationController } from '@/controllers/moderation.controller';

const container = new Container();

container
  .bind<ModerationController>(TYPES.ModerationController)
  .to(ModerationController);
container
  .bind<ModerationService>(TYPES.ModerationService)
  .to(ModerationService);
container
  .bind<ModerationRepository>(TYPES.ModerationRepository)
  .to(ModerationRepository);

export { container };
