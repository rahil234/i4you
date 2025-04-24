import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { UserService } from '@/services/user.service';
import { handleAsync } from '@/utils/handle-async';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  getUser = handleAsync(async (req, res) => {
    const userId = req.header('X-User-Id');
    const userRole = req.header('X-User-Role') as 'admin' | 'member';

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await this.userService.getUserById(userId, userRole);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  });

  updateUserStatus = handleAsync(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    console.log('updateUserStatus', userId, 'with status', status);

    // const user = await this.userService.getUserById(userId, 'member');
    //
    // if (!user) {
    //   res.status(404).json({ message: 'User not found' });
    //   return;
    // }

    await this.userService.updateUserStatus(userId, status);

    res.status(200).json();
  });

  getUsers = handleAsync(async (req, res) => {
    const users = await this.userService.getUsers();
    res.status(200).json(users);
  });
}
