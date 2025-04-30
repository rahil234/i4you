import express from 'express';
import type {UserController} from '@/controllers/user.controller';
import {container} from "@/config/inversify.config";
import {TYPES} from "@/types";

const router = express.Router();

const userController = container.get<UserController>(TYPES.UserController);

/**
 * @swagger
 * /ap/v1/user:
 *   get:
 *     summary: Get all users
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
router.get('/me', userController.getUser);

export default router;
