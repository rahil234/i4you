import { Router } from 'express';
import { MediaController } from '@/controllers/media.controller';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';

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
router.get('/upload-url', mediaController.getUploadUrl);

export default router;
