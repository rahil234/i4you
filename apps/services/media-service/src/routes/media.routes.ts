import { Router } from 'express';
import { MediaController } from '@/controllers/media.controller';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { authenticateAndAuthorizeMiddleware } from '@/middlwares/authenticate-and-authorize.middleware';

const router = Router();
const mediaController = container.get<MediaController>(TYPES.MediaController);

/**
 * @swagger
 * /api/v1/media/upload-url:
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
router.get(
  '/upload-url',
  authenticateAndAuthorizeMiddleware(['member']),
  mediaController.getUploadUrl
);

/**
 * @swagger
 * /api/v1/media/get-images:
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
router.get('/get-images/:userId', mediaController.getImages);

/**
 * @swagger
 * /api/v1/media/image:
 *   delete:
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
router.delete('/image/:imageUrl', mediaController.deleteImage);

export default router;
