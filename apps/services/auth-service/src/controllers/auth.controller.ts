import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { inject, injectable } from 'inversify';
import { verifyRefreshToken } from '@/utils/jwt';
import { TYPES } from '@/types';
import { setRefreshCookie } from '@/utils/cookie';

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.body
    );

    setRefreshCookie(res, refreshToken);

    console.log('User:', user, 'Token:', accessToken);

    res.json({ accessToken, user });
  };

  googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

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
  };

  register = async (req: Request, res: Response) => {
    const { accessToken, user, refreshToken } = await this.authService.register(
      req.body
    );

    setRefreshCookie(res, refreshToken);

    res.status(201).json({ accessToken, user });
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    console.log('refreshing token', refreshToken);
    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    verifyRefreshToken(refreshToken);

    res.json({ token: refreshToken });
  };

  logout = (_req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out' });
  };
}
