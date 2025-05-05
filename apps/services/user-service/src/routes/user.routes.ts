import express from 'express';
import type { UserController } from '@/controllers/user.controller';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';
import { authenticateAndAuthorizeMiddleware } from '@/middlwares/authenticate-and-authorize.middleware';

const router = express.Router();

const userController = container.get<UserController>(TYPES.UserController);

/**
 * @swagger
 * /ap/v1/user:
 *   get:
 *     summary: Get all user's
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Get all users
 */
router.get('/', userController.getUsers);

/**
 * @swagger
 * /ap/v1/user/:userId/status:
 *   patch:
 *     summary: Update user status
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 */
router.patch('/:userId/status', userController.updateUserStatus);

/**
 * @swagger
 * /ap/v1/user/me:
 *   get:
 *     summary: Get user by token
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Login successful
 */
router.get(
  '/me',
  authenticateAndAuthorizeMiddleware(['member']),
  userController.getUser
);

/**
 * @swagger
 * /ap/v1/user/onboarding:
 *   post:
 *     summary: Upload user onBoarding data
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: upload successful
 */
router.post(
  '/onboarding',
  authenticateAndAuthorizeMiddleware(['member']),
  userController.onBoarding
);

/**
 * @swagger
 * /ap/v1/user/matches:
 *   get:
 *   summary: Get all user's matches
 *   tags:
 *   - User
 *   security:
 *   - bearerAuth: []
 *   responses:
 *   200:
 *     description: Get all matches
 *     content:
 *     application/json:
 *     schema:
 *     type: array
 *     items:
 *     type: object
 *     properties:
 *     id:
 *     type: string
 *     description: Match ID
 *     userId:
 *     type: string
 *     description: User ID
 *     matchedUserId:
 *     type: string
 *     description: Matched User ID
 *     createdAt:
 *     type: string
 *     description: Match creation date
 *     properties:
 *     user:
 *     type: object
 *     description: User object
 *     properties:
 *     id:
 *     type: string
 *     description: User ID
 *     name:
 *     type: string
 *     description: User name
 *     photos:
 *     type: array
 *     items:
 *     type: string
 *     description: User photo URL
 *     location:
 *     type: string
 *     description: User location
 *     bio:
 *     type: string
 *     description: User bio
 *     age:
 *     type: number
 *     description: User age
 *     */
router.get(
  '/matches',
  authenticateAndAuthorizeMiddleware(['member']),
  userController.getMatches
);

export default router;
