import { ModerationController } from '@/controllers/moderation.controller';
import { FastifyInstance } from 'fastify';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';

const moderationController = container.get<ModerationController>(TYPES.ModerationController);

export async function moderationRoutes(fastify: FastifyInstance) {

  /**
   * @swagger
   * /api/v1/moderation/pending:
   *   get:
   *     summary: Generate a signed URL for S3 upload
   *     tags:
   *       - Media
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Signed URL-generated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 url:
   *                   type: string
   *                 key:
   *                   type: string
   *       401:
   *         description: Unauthorized
   */
  fastify.get('/pending/images', {
    schema: {
      response: {
        200: {
          type: 'array',
          properties: {
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  publicId: { type: 'string' },
                  url: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                },
              },
            },
          },
        },
      },
    },
    handler: moderationController.getPendingModerationImages,
  });

  fastify.patch('/', {
    schema: {
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['approved', 'rejected'] },
        },
      },
    },
    handler: moderationController.updateModeration,
  });
}
