import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { handleAsync } from '@/utils/handle-async';
import OnboardingRequestDTO from '@/dtos/onboarding.request.dtos';
import UserDTO from '@/dtos/user.dtos';
import AdminDTO from '@/dtos/admin.dtos';
import { USER_RESPONSE_MESSAGES } from '@/constants/response-messages.constant';
import { USER_ROLES } from '@/constants/roles.constant';
import { HTTP_STATUS } from '@/constants/http-status.constant';
import { IUserService } from '@/services/interfaces/IUserService';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private _userService: IUserService) {}

  getUser = handleAsync(async (req, res) => {
    const { id: userId, role } = req.user;

    const user = await this._userService.getUserById(userId, role);

    if (!user) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: USER_RESPONSE_MESSAGES.NOT_FOUND });
      return;
    }

    const photos = await this._userService.getUserPhotos(user.id);

    const data =
      role === USER_ROLES.ADMIN
        ? new AdminDTO(user)
        : new UserDTO(user, photos);

    res.status(HTTP_STATUS.OK).json(data);
  });

  updateUser = handleAsync(async (req, res) => {
    const { id } = req.user;
    const { data } = req.body;

    const newUser = await this._userService.updateUser(id, data);

    const photos = await this._userService.getUserPhotos(newUser.id);

    res.status(HTTP_STATUS.OK).json(new UserDTO(newUser, photos));
  });

  updateUserStatus = handleAsync(async (req, res) => {
    const { userId } = req.params;

    const { status } = req.body;

    await this._userService.updateUserStatus(userId, status);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: USER_RESPONSE_MESSAGES.STATUS_UPDATED });
  });

  getUsers = handleAsync(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      gender = '',
    } = req.query;

    const result = await this._userService.getUsers({
      page: Number(page),
      limit: Number(limit),
      search: String(search),
      status: String(status),
      gender: String(gender),
    });

    res.status(HTTP_STATUS.OK).json(result);
  });

  likeUser = handleAsync(async (req, res) => {
    const { userId } = req.params;

    const match = await this._userService.likeUser(req.user.id, userId);

    if (match) {
      res.status(HTTP_STATUS.OK).json(match);
    } else {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: USER_RESPONSE_MESSAGES.NOT_FOUND });
    }
  });

  onBoarding = handleAsync(async (req, res) => {
    const { data } = req.body;

    const userId = req.user.id;

    await this._userService.onBoarding(userId, new OnboardingRequestDTO(data));

    res
      .status(HTTP_STATUS.OK)
      .json({ message: USER_RESPONSE_MESSAGES.UPDATED });
  });
}
