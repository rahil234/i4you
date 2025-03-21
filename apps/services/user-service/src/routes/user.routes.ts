import express from 'express';
import { UserController } from '@/controllers/user.controller';
import { UserService } from '@/services/user.service';
import { UserRepositoryImpl } from '@/repositories/user.repository';

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/login', userController.login);

export default router;
