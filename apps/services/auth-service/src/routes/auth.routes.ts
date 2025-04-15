import express from 'express';
import { AuthController } from '@/controllers/auth.controller';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/types';

const router = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/get-user', authController.getUser);

router.post('/refresh-token', authController.refreshToken);

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/logout', authController.logout);

router.post('/login/google', authController.googleLogin);

export default router;
