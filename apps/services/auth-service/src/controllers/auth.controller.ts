import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { getUserById } from '@/grpc/user.client.helpers';
import { AuthService } from '@/services/auth.service';
import { handleAsync } from '@/utils/handle-async';
import { setRefreshCookie } from '@/utils/cookie';
import { verifyRefreshToken } from '@/utils/jwt';

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

    res.status(401).json({ message: 'Login failed' });
  });

  register = handleAsync(async (req, res) => {
    const { accessToken, user, refreshToken } = await this.authService.register(
      req.body
    );

    setRefreshCookie(res, refreshToken);

    res.status(201).json({ accessToken, user });
  });

  refreshToken = handleAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    console.log('refreshing token', refreshToken);

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { sub: userId } = verifyRefreshToken(refreshToken);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      accessToken,
      user,
      refreshToken: newRefreshToken,
    } = await this.authService.refreshToken(userId);

    console.log('new refresh token', newRefreshToken);

    setRefreshCookie(res, newRefreshToken);

    res.json({ token: accessToken, user });
  });

  logout = handleAsync((_req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out' });
  });
}
