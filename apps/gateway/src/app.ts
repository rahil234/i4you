import express, {Request, Response, NextFunction} from 'express';
import "@/config"
import {expressjwt} from 'express-jwt';
import cors from 'cors';
import {createProxyMiddleware} from 'http-proxy-middleware';
import httpLogger from "@repo/http-logger";
import * as path from "node:path";
import {env} from "@/config";
import cookieParser from "cookie-parser";

const app = express();

app.use(httpLogger());
app.use(httpLogger({logFilePath: path.join(__dirname, "logs/gateway.log")}));

app.use(cookieParser());

const ALLOWED_ORIGINS = env.ALLOWED_ORIGINS;

const allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : ["http://localhost:3000"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(
    expressjwt({
        secret: env.JWT_SECRET,
        algorithms: ['HS256'],
    }).unless({
        path: [
            '/public',
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/auth/refresh-token',
            '/api/v1/auth/logout',
        ],
    })
);

app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.auth) {
        req.headers['X-User-ID'] = req.auth.sub;
    }
    console.log("Request User: ", req.auth);
    next();
});

const createProxy = (target: string, pathRewrite: Record<string, string>) => {
    return createProxyMiddleware<Request, Response>({
        target,
        changeOrigin: true,
        pathRewrite,
        on: {
            proxyReq: (proxyReq, req) => {
                const userId = req.headers['X-User-ID'];
                if (userId) {
                    proxyReq.setHeader('X-User-ID', userId);
                }
            },
            proxyRes: (proxyRes, req, _res) => {
                console.log(req.url, ": Response: ", proxyRes.statusCode);
            },
            error: (err, _req, res) => {
                console.error('Proxy error:', err);
                if ('status' in res) {
                    res.status(500).json({error: 'Unexpected error'});
                }
            },
        },
    });
};

app.use('/api/v1/auth', createProxy(env.AUTH_SERVER_URL, {'^/api/v1/auth': ''}));
app.use('/api/v1/user', createProxy(env.USER_SERVER_URL, {'^/api/v1/user': ''}));

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({error: 'Invalid or missing token'});
    } else {
        next(err);
    }
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = env.PORT;

app.listen(PORT, () => {
    console.log(`Reverse proxy with JWT validation running on port ${PORT}`);
});
