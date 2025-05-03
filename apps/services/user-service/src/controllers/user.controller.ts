import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { UserService } from '@/services/user.service';
import { handleAsync } from '@/utils/handle-async';
import { AuthError } from '@/errors/AuthError';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  getUser = handleAsync(async (req, res) => {
    const { id: userId, role } = req.user;

    const user = await this.userService.getUserById(userId, role);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  });

  updateUserStatus = handleAsync(async (req, res) => {
    const { id: userId } = req.user;
    const { status } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await this.userService.updateUserStatus(userId, status);

    res.status(200).json();
  });

  getUsers = handleAsync(async (req, res) => {
    const users = await this.userService.getUsers();
    res.status(200).json(users);
  });

  onBoarding = handleAsync(async (req, res, next) => {
    const { data } = req.body;

    const userId = req.user.id;

    await this.userService.onBoarding(userId, data);

    res.status(200).json({ message: 'user onboarded successfully' });
  });
}
