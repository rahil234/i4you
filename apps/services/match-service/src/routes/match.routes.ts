import express from 'express';
import type { MatchController } from '@/controllers/match.controller';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { authenticateAndAuthorizeMiddleware } from '@/middlwares/authenticate-and-authorize.middleware';

const router = express.Router();

const matchController = container.get<MatchController>(TYPES.MatchController);

/**
 * @swagger
 * /api/v1/user/matches:
 *   get:
 *     summary: Get all user's matches
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get all matches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Match ID
 *                   userId:
 *                     type: string
 *                     description: User ID
 *                   matchedUserId:
 *                     type: string
 *                     description: Matched User ID
 *                   createdAt:
 *                     type: string
 *                     description: Match creation date
 *                   user:
 *                     type: object
 *                     description: User object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: User ID
 *                       name:
 *                         type: string
 *                         description: Username
 *                       photos:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: User photo URLs
 *                       location:
 *                         type: string
 *                         description: User location
 *                       bio:
 *                         type: string
 *                         description: User bio
 *                       age:
 *                         type: number
 *                         description: User age
 */
router.get(
  '/',
  authenticateAndAuthorizeMiddleware(['member']),
  matchController.getMatches
);

export default router;
