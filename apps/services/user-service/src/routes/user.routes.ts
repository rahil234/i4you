import express from 'express';
import type {UserController} from '@/controllers/user.controller';
import httpLogger from "@repo/http-logger";
import {container} from "@/config/inversify.config";
import {TYPES} from "@/types";

const router = express.Router();

const userController = container.get<UserController>(TYPES.UserController);

router.get('/health', (_req, res) => {
    res.send('User Service is up and running');
});

router.get('/me', userController.getUser);

export default router;
