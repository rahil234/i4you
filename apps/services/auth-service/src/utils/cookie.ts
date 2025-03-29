import type {CookieOptions, Response} from 'express';
import {env} from "@/config";

export const setRefreshCookie = (res: Response, token: string) => {
    const ENV = env.NODE_ENV;
    const options: CookieOptions = {
        httpOnly: true,
        secure: ENV && false,
        sameSite: 'lax',
        path: '/api/v1/auth/refresh-token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", token, options);
};
