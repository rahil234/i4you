import {NextFunction, Request, Response} from 'express';
import {AuthService} from '@/services/auth.service';
import {inject, injectable} from "inversify";
import {verifyRefreshToken} from "@/utils/jwt";
import {TYPES} from "@/types";
import {setRefreshCookie} from "@/utils/cookie";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: AuthService) {
    }

    login = async (req: Request, res: Response) => {
        try {
            const {accessToken, refreshToken, user} = await this.authService.login(req.body);

            setRefreshCookie(res, refreshToken);

            console.log('User:', user, 'Token:', accessToken, 'Refresh:', refreshToken);

            res.json({accessToken, user});
        } catch (error) {
            res.status(401).json({message: 'Login failed'});
        }
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {accessToken, user, refreshToken} = await this.authService.register(req.body);

            setRefreshCookie(res, refreshToken);

            res.status(201).json({accessToken, user});
        } catch (error: any) {
            console.error('Error registering user:', error);

            if (error.code === 11000) {
                res.status(400).json({message: 'Email already exists'});
                return
            }

            next(error);
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                res.status(401).json({message: 'Unauthorized'});
                return
            }

            verifyRefreshToken(refreshToken);

            res.json({token: refreshToken});
        } catch (error) {
            console.error('Error refreshing token:', error);
            res.status(401).json({message: 'Unauthorized'});
        }
    }

    logout = (_req: Request, res: Response) => {
        res.clearCookie('refreshToken');
        res.status(200).json({message: 'Logged out'});
    }
}
