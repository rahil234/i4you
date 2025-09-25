import { ModerationService } from '@/services/moderation.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/types';
import { RouteHandler } from 'fastify';
import { HTTP_STATUS } from '@/constants/http-status.constant';
import {
  MODERATION_MESSAGES,
  MODERATION_STATUS,
} from '@/constants/response-messages.constant';

@injectable()
export class ModerationController {
  constructor(
    @inject(TYPES.ModerationService)
    private moderationService: ModerationService,
  ) {}

  getPendingModerationImages: RouteHandler = async (req, reply) => {
    const { status } = req.query as {
      status: 'approved' | 'pending' | 'rejected';
      sortBy?: string;
    };

    const images = await this.moderationService.getPendingImages(status);

    reply.status(HTTP_STATUS.OK).send({
      statusCode: HTTP_STATUS.OK,
      message: MODERATION_MESSAGES.FETCH_SUCCESS,
      data: images,
    });
  };

  updateModeration: RouteHandler = async (req, reply) => {
    const { status, publicId } = req.body as {
      status: 'approved' | 'rejected';
      publicId: string;
    };

    if (
      ![MODERATION_STATUS.APPROVED, MODERATION_STATUS.REJECTED].includes(status)
    ) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: MODERATION_MESSAGES.INVALID_STATUS,
      });
    }

    const updated = await this.moderationService.updateModerationStatus(
      publicId,
      status,
    );

    reply.status(HTTP_STATUS.OK).send({
      statusCode: HTTP_STATUS.OK,
      message: MODERATION_MESSAGES.UPDATE_SUCCESS,
      data: updated,
    });
  };
}
