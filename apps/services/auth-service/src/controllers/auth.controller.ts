import { inject, injectable } from 'inversify';

import { createError } from '@i4you/http-errors';

import { TYPES } from '@/types';
import { handleAsync } from '@/utils/handle-async';
import {
  clearAuthCookie,
  setAccessCookie,
  setRefreshCookie,
} from '@/utils/cookie';
import { IAuthService } from '@/services/interfaces/IAuthService';
import { HTTP_STATUS } from '@/constants/http-status.constant';
import {
  AUTH_RESPONSE_MESSAGES,
  USER_RESPONSE_MESSAGES,
} from '@/constants/response-messages.constant';

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private _authService: IAuthService) {}

  login = handleAsync(async (req, res) => {
    const { accessToken, refreshToken, user } = await this._authService.login(
      req.body
    );

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    res.status(HTTP_STATUS.OK).json({ accessToken, user });
  });

  register = handleAsync(async (req, res) => {
    await this._authService.register(req.body);

    res.status(HTTP_STATUS.CREATED).json({
      message: AUTH_RESPONSE_MESSAGES.REGISTER_SUCCESS,
    });
  });

  adminLogin = handleAsync(async (req, res) => {
    const { accessToken, refreshToken, user } =
      await this._authService.adminLogin(req.body);

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    res.status(HTTP_STATUS.OK).json({ accessToken, user });
  });

  googleRegister = handleAsync(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      next(
        createError.Unauthorized(AUTH_RESPONSE_MESSAGES.GOOGLE_TOKEN_REQUIRED)
      );
    }

    await this._authService.googleRegister(token);

    res.status(HTTP_STATUS.OK).json({
      message: AUTH_RESPONSE_MESSAGES.GOOGLE_REGISTER_SUCCESS,
    });
  });

  googleLogin = handleAsync(async (req, res) => {
    const { token } = req.body;

    if (!token) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: USER_RESPONSE_MESSAGES.UNAUTHORIZED });
      return;
    }

    const { accessToken, refreshToken, user } =
      await this._authService.googleLogin(token);

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    res.status(HTTP_STATUS.OK).json({ accessToken, user });
  });

  facebookRegister = handleAsync(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      next(
        createError.Unauthorized(AUTH_RESPONSE_MESSAGES.FACEBOOK_TOKEN_REQUIRED)
      );
    }

    const user = await this._authService.facebookRegister(token);

    if (!user) {
      next(
        createError.Internal(AUTH_RESPONSE_MESSAGES.FACEBOOK_REGISTER_FAILED)
      );
    }

    res.json({ message: AUTH_RESPONSE_MESSAGES.FACEBOOK_REGISTER_SUCCESS });
  });

  facebookLogin = handleAsync(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      next(
        createError.Unauthorized(AUTH_RESPONSE_MESSAGES.FACEBOOK_TOKEN_REQUIRED)
      );
      return;
    }

    const { accessToken, refreshToken, user } =
      await this._authService.facebookLogin(token);

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    res.status(HTTP_STATUS.OK).json({ accessToken, user });
  });

  changePassword = handleAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!currentPassword || !newPassword) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: AUTH_RESPONSE_MESSAGES.PASSWORD_REQUIRED });
      return;
    }

    await this._authService.changePassword(id, currentPassword, newPassword);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: AUTH_RESPONSE_MESSAGES.PASSWORD_CHANGED });
  });

  forgetPassword = handleAsync(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: AUTH_RESPONSE_MESSAGES.EMAIL_REQUIRED });
      return;
    }

    await this._authService.forgetPassword(email);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: AUTH_RESPONSE_MESSAGES.FORGOT_PASSWORD_SUCCESS });
  });

  resetPassword = handleAsync(async (req, res) => {
    const { password, token } = req.body;

    if (!password || !token) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: AUTH_RESPONSE_MESSAGES.RESET_PASSWORD_REQUIRED });
      return;
    }

    await this._authService.resetPassword(password, token);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: AUTH_RESPONSE_MESSAGES.RESET_PASSWORD_SUCCESS });
  });

  verifyAccount = handleAsync(async (req, res) => {
    const { password, token } = req.body;

    if (!password || !token) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: AUTH_RESPONSE_MESSAGES.VERIFY_ACCOUNT_REQUIRED });
      return;
    }

    await this._authService.verifyAccount(password, token);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: AUTH_RESPONSE_MESSAGES.VERIFY_ACCOUNT_SUCCESS });
  });

  refreshToken = handleAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: USER_RESPONSE_MESSAGES.UNAUTHORIZED });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this._authService.refreshToken(refreshToken);

    if (!accessToken) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: USER_RESPONSE_MESSAGES.UNAUTHORIZED });
      return;
    }

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, newRefreshToken);

    res.status(HTTP_STATUS.OK).json({ token: accessToken });
  });

  logout = handleAsync(async (req, res) => {
    const token = req.cookies['refreshToken'];
    await this._authService.logout(req.user.id, token);
    clearAuthCookie(res);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: AUTH_RESPONSE_MESSAGES.LOGOUT_SUCCESS });
  });
}
