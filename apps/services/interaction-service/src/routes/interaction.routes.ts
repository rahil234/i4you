import express from 'express';
import type { InteractionController } from '@/controllers/interaction.controller';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { authenticateAndAuthorizeMiddleware } from '@/middlwares/authenticate-and-authorize.middleware';
import { USER_ROLES } from '@/constants/roles.constant';

const router = express.Router();

const interactionController = container.get<InteractionController>(
  TYPES.InteractionController
);

/**
 * @swagger
 * /api/v1/interaction:
 *   post:
 *     summary: Create a new interaction
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interaction created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/:userId/like',
  authenticateAndAuthorizeMiddleware([USER_ROLES.MEMBER]),
  interactionController.likeUser
);

/**
 * @swagger
 * /api/v1/interaction:
 *   post:
 *     summary: Create a new interaction
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interaction created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/:userId/dislike',
  authenticateAndAuthorizeMiddleware([USER_ROLES.MEMBER]),
  interactionController.dislikeUser
);

/**
 * @swagger
 * /api/v1/interaction:
 *   post:
 *     summary: Create a new interaction
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interaction created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/:userId/super-like',
  authenticateAndAuthorizeMiddleware([USER_ROLES.MEMBER]),
  interactionController.superLikeUser
);

export default router;
