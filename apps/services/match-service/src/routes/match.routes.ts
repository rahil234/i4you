import express from 'express';
import type { MatchController } from '@/controllers/match.controller';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { authenticateAndAuthorizeMiddleware } from '@/middlwares/authenticate-and-authorize.middleware';

const router = express.Router();

const matchController = container.get<MatchController>(TYPES.MatchController);

/**
 * @swagger
 * /api/v1/match:
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

/**
 * @swagger
 * /api/v1/match/potential-matches:
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
  '/potential-matches',
  authenticateAndAuthorizeMiddleware(['member']),
  matchController.getPotentialMatches
);

/**
 * @swagger
 * /api/v1/match/block/{matchId}:
 *   post:
 *     summary: Block a match
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the match to block
 *     responses:
 *       200:
 *         description: Match blocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Match blocked successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid match ID
 */
router.delete(
  '/:matchId',
  authenticateAndAuthorizeMiddleware(['member']),
  matchController.blockMatch
);

router.get(
  '/blocked',
  authenticateAndAuthorizeMiddleware(['member']),
  matchController.getBlockedMatches
);

router.patch(
  '/:matchId/unblock',
  authenticateAndAuthorizeMiddleware(['member']),
  matchController.unblockMatch
);

export default router;
