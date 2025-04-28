import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { getUserById } from '@/grpc/user.client.helpers';
import { AuthService } from '@/services/auth.service';
import { handleAsync } from '@/utils/handle-async';
import { setRefreshCookie } from '@/utils/cookie';

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  getUser = handleAsync(async (req, res) => {
    try {
      const { userId } = req.body;
      console.log('Getting user with ID:', userId);
      const user = await getUserById(userId);
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

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken);

    res.json({ accessToken, user });
  });

  adminLogin = handleAsync(async (req, res) => {
    const { accessToken, refreshToken, user } =
      await this.authService.adminLogin(req.body);

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken);

    res.json({ accessToken, user });
  });

  googleLogin = handleAsync(async (req, res) => {
    const { token } = req.body;

    console.log('Google login token:', token);

    // verify the token
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { accessToken, refreshToken, user } =
      await this.authService.googleLogin(token);

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken, 'Refresh:', refreshToken);

    res.json({ accessToken, user });
  });

  register = handleAsync(async (req, res) => {
    const { accessToken, user, refreshToken } = await this.authService.register(
      req.body
    );

    setRefreshCookie(res, refreshToken);

    res.status(201).json({ accessToken, user });
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

    res.status(200).json({ message: 'Account Verfication Successfull' });
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

    console.log('Access token:\n', accessToken);

    setRefreshCookie(res, newRefreshToken);

    res.json({ token: accessToken, user });
  });

  logout = handleAsync((_req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out' });
  });
}
