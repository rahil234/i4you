import express, {Request, Response, NextFunction} from 'express';
import {expressjwt} from 'express-jwt';
import {createProxyMiddleware} from 'http-proxy-middleware';
import {Auth} from '../types/jwt-payload';

// Initialize Express app
const app = express();

// Configuration
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
const port = process.env.PORT || 8080;

// JWT Validation Middleware
app.use(
    expressjwt({
        secret: jwtSecret,
        algorithms: ['HS256'],
    }).unless({path: ['/public']})
);

// Custom Middleware: Add User Info to Proxied Request
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        // req.user is now typed as Auth.JwtPayload | undefined
        const user = req.user as Auth.JwtPayload; // Type assertion (safe after express-jwt)
        req.headers['X-User-ID'] = user.sub;
        console.log(`Forwarding request for user: ${user.name}`);
    }
    next();
});

// Proxy Middleware
const proxyMiddleware = createProxyMiddleware<Request, Response>({
    target: backendUrl,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req) => {
            // Forward the user ID to the backend
            const userId = req.headers['X-User-ID'];
            if (userId) {
                proxyReq.setHeader('X-User-ID', userId);
            }
        },
        proxyRes: (proxyRes, req, res) => {
            // Log the response status code
            console.log(`Response status code: ${proxyRes.statusCode}`);
        },
        error: (err, req, res) => {
            console.error('Proxy error:', err);
            if ('status' in res)
                res.status(500).json({error: 'Unexpected error'});
        },
    }
});

app.use('/api', proxyMiddleware);

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({error: 'Invalid or missing token'});
    } else {
        next(err);
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Reverse proxy with JWT validation running on port ${port}`);
});
