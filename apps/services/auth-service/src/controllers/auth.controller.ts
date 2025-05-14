import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { AuthService } from '@/services/auth.service';
import { handleAsync } from '@/utils/handle-async';
import {
  clearAuthCookie,
  setAccessCookie,
  setRefreshCookie,
} from '@/utils/cookie';
import { UserGrpcService } from '@/services/user.grpc.service';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
    @inject(TYPES.UserGrpcService) private userGrpcService: UserGrpcService
  ) {}

  getUser = handleAsync(async (req, res) => {
    try {
      const { userId } = req.body;
      console.log('Getting user with ID:', userId);
      const user = await this.userGrpcService.findUserById(userId);
      console.log('User:', user);
      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  login = handleAsync(async (req, res) => {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.body
    );

    setAccessCookie(res, accessToken);

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken);

    res.json({ accessToken, user });
  });

  adminLogin = handleAsync(async (req, res) => {
    const { accessToken, refreshToken, user } =
      await this.authService.adminLogin(req.body);

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken);

    res.json({ accessToken, user });
  });

  googleLogin = handleAsync(async (req, res) => {
    const { token } = req.body;

    console.log('Google login token:', token);

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { accessToken, refreshToken, user } =
      await this.authService.googleLogin(token);

    setAccessCookie(res, accessToken);

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken, 'Refresh:', refreshToken);

    res.json({ accessToken, user });
  });

  facebookLogin = handleAsync(async (req, res) => {
    const { token } = req.body;

    console.log('Facebook login token:', token);

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { accessToken, refreshToken, user } =
      await this.authService.facebookLogin(token);

    setAccessCookie(res, accessToken);

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken, 'Refresh:', refreshToken);

    res.json({ accessToken, user });
  });

  register = handleAsync(async (req, res) => {
    await this.authService.register(req.body);

    res.status(201).json({
      message: 'User created and send verification email successfully',
    });
  });

  changePassword = handleAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ message: 'currentPassword and newPassword is required' });
      return;
    }

    await this.authService.changePassword(id, currentPassword, newPassword);

    res.status(200).json({ message: 'Password Changed Successfully' });
  });

  forgetPassword = handleAsync(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    await this.authService.forgetPassword(email);

    res.status(200).json({ message: 'Password reset link sent' });
  });

  resetPassword = handleAsync(async (req, res) => {
    const { password, token } = req.body;

    if (!password || !token) {
      res.status(400).json({ message: 'password and token is required' });
      return;
    }

    await this.authService.resetPassword(password, token);

    res.status(200).json({ message: 'Password Changed Successfully' });
  });

  verifyAccount = handleAsync(async (req, res) => {
    const { password, token } = req.body;

    if (!password || !token) {
      res.status(400).json({ message: 'password and token is required' });
      return;
    }

    await this.authService.verifyAccount(password, token);

    res.status(200).json({ message: 'Account Verification Successfully' });
  });

  refreshToken = handleAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      accessToken,
      user,
      refreshToken: newRefreshToken,
    } = await this.authService.refreshToken(refreshToken);

    if (!accessToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    setAccessCookie(res, accessToken);

    setRefreshCookie(res, newRefreshToken);

    res.json({ token: accessToken, user });
  });

  logout = handleAsync((_req, res) => {
    clearAuthCookie(res);
    res.status(200).json({ message: 'Logged out' });
  });
}
