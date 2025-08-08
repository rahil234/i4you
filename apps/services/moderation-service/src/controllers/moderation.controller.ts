import { ModerationService } from '@/services/moderation.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types';
import { RouteHandler } from 'fastify';

@injectable()
export class ModerationController {
  constructor(@inject(TYPES.ModerationService) private moderationService: ModerationService) {
  }

  getPendingModerationImages: RouteHandler = async (req, reply) => {
    const { status, sortBy } = req.query as { status: 'approved' | 'rejected' | 'pending'; sortBy?: string };
    const images = await this.moderationService.getPendingImages(status, sortBy);
    reply.send(images);
  };

  updateModeration: RouteHandler = async (req, reply) => {
    const { status, publicId } = req.body as { status: 'approved' | 'rejected'; publicId: string };

    if (!['approved', 'rejected'].includes(status)) {
      return reply.status(400).send({ error: 'Invalid status' });
    }

    const updated = await this.moderationService.updateModerationStatus(publicId, status);
    reply.send({ message: 'Moderation updated', ...updated });
  };
}
