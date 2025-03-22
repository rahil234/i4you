import express, {Request, Response, NextFunction} from 'express';
// import {expressjwt} from 'express-jwt';
import {createProxyMiddleware} from 'http-proxy-middleware';
import {Auth} from '../types/jwt-payload';

const app = express();

// const jwtSecret = process.env.JWT_SECRET;
const USER_SERVER_URI = process.env.USER_SERVER_URI;
const PORT = process.env.PORT;

// if (!USER_SERVER_URL) {
//     console.error('USER_HTTP_PORT environment variable is required');
//     process.exit(1);
// } else if (!PORT) {
//     console.error('PORT environment variable is required');
//     process.exit(1);
// }
//
// if (jwtSecret) {
//     app.use(
//         expressjwt({
//             secret: jwtSecret,
//             algorithms: ['HS256'],
//         }).unless({path: ['/public']})
//     );
// }

app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.user) {
        const user = req.user as Auth.JwtPayload;
        req.headers['X-User-ID'] = user.sub;
        console.log(`Forwarding request for user: ${user.name}`);
    }
    console.log("URL: ", req.url);
    next();
});

const proxyMiddleware = createProxyMiddleware<Request, Response>({
    target: USER_SERVER_URI,
    changeOrigin: true,
    pathRewrite: {'^/api/user': ''},
    on: {
        proxyReq: (proxyReq, req) => {
            console.log("Request-proxing: ", req.url);
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
            if ('status' in res)
                res.status(500).json({error: 'Unexpected error'});
        },
    }
});

app.use('/api/user', proxyMiddleware);

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({error: 'Invalid or missing token'});
    } else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Reverse proxy with JWT validation running on port ${PORT}`);
});
