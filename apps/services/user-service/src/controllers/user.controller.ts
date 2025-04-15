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
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await this.userService.getUserById(userId);

    res.status(200).json(user);
  });
}
