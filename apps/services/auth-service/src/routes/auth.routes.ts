import express from 'express';
import {AuthController} from '@/controllers/auth.controller';
import httpLogger from "@repo/http-logger";
import {container} from "@/config/inversify.config";
import {TYPES} from "@/types";

const router = express.Router();

const authController = container.get<AuthController>(TYPES.AuthController);

router.get('/refresh-token', authController.refreshToken);

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/logout', authController.logout);

export default router;
