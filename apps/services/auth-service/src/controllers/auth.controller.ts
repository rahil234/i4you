import { inject, injectable } from 'inversify';

import { createError } from '@i4you/http-errors';

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

  login = handleAsync(async (req, res) => {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.body
    );

    setAccessCookie(res, accessToken);

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken);

    res.json({ accessToken, user });
  });

  register = handleAsync(async (req, res) => {
    await this.authService.register(req.body);

    res.status(201).json({
      message: 'User created and send verification email successfully',
    });
  });

  adminLogin = handleAsync(async (req, res) => {
    const { accessToken, refreshToken, user } =
      await this.authService.adminLogin(req.body);

    setAccessCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    res.json({ accessToken, user });
  });

  googleRegister = handleAsync(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      console.error('Required Google token is missing');
      next(createError.Unauthorized('Google token is required'));
    }

    await this.authService.googleRegister(token);

    res.json({ message: 'User registered successfully' });
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

  facebookRegister = handleAsync(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      next(createError.Unauthorized('Facebook token is required'));
    }

    const user = await this.authService.facebookRegister(token);

    if (!user) {
      next(
        createError.Internal('Registration failed. Please try again later.')
      );
    }

    res.json({ message: 'User registered successfully' });
  });

  facebookLogin = handleAsync(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      next(createError.Unauthorized('Facebook token is required'));
      return;
    }

    const { accessToken, refreshToken, user } =
      await this.authService.facebookLogin(token);

    setAccessCookie(res, accessToken);

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken, 'Refresh:', refreshToken);

    res.json({ accessToken, user });
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

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshToken(refreshToken);

    if (!accessToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    setAccessCookie(res, accessToken);

    setRefreshCookie(res, newRefreshToken);

    res.json({ token: accessToken });
  });

  logout = handleAsync(async (req, res) => {
    const token = req.cookies['refreshToken'];
    console.log('Logout token:', { token, user: req.user });
    await this.authService.logout(req.user.id, token);
    clearAuthCookie(res);
    res.status(200).json({ message: 'Logged out' });
  });
}
