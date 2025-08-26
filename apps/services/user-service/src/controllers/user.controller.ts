import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { UserService } from '@/services/user.service';
import { handleAsync } from '@/utils/handle-async';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import UserDTO from '@/dtos/user.dtos';
import AdminDTO from '@/dtos/admin.dtos';
import { UserDocument } from '@/models/user.model';
import { USER_RESPONSE_MESSAGES } from '@/constants/response-messages.constant';
import { USER_ROLES } from '@/constants/roles.constant';
import { HTTP_STATUS } from '@/constants/http-status.constant';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  getUser = handleAsync(async (req, res) => {
    const { id: userId, role } = req.user;

    const user = await this.userService.getUserById(userId, role);

    if (!user) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: USER_RESPONSE_MESSAGES.NOT_FOUND });
      return;
    }

    const photos = await this.userService.getUserPhotos(String(user._id));

    const data =
      role === USER_ROLES.ADMIN
        ? new AdminDTO(user)
        : new UserDTO(user as UserDocument, photos);

    res.status(HTTP_STATUS.OK).json(data);
  });

  updateUser = handleAsync(async (req, res) => {
    const { id } = req.user;
    const { data } = req.body;

    if (!id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newUser = await this.userService.updateUser(id, data);

    const photos = await this.userService.getUserPhotos(String(newUser._id));

    res.status(200).json(new UserDTO(newUser, photos));
  });

  updateUserStatus = handleAsync(async (req, res) => {
    const { userId } = req.params;

    const { status } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await this.userService.updateUserStatus(userId, status);

    res.status(200).json({ message: 'User status updated successfully' });
  });

  getUsers = handleAsync(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      gender = '',
    } = req.query;

    const result = await this.userService.getUsers({
      page: Number(page),
      limit: Number(limit),
      search: String(search),
      status: String(status),
      gender: String(gender),
    });

    res.status(200).json(result);
  });

  likeUser = handleAsync(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const match = await this.userService.likeUser(req.user.id, userId);

    if (match) {
      res.status(200).json(match);
    } else {
      res.status(404).json({ message: 'No match found' });
    }
  });

  onBoarding = handleAsync(async (req, res) => {
    const { data } = req.body;

    const userId = req.user.id;

    await this.userService.onBoarding(userId, new OnboardingRequestDTO(data));

    res.status(200).json({ message: 'user onboarded successfully' });
  });
}
