import express, { Request, Response, NextFunction } from 'express';
import * as path from 'node:path';
import redoc from 'redoc-express';
import { expressjwt } from 'express-jwt';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import swaggerUi from 'swagger-ui-express';

import { env } from '@/config';
import httpLogger from 'express-logr';
import { loadSpecs } from '@/config/swagger.config';

const app = express();

app.use(httpLogger());
app.use(httpLogger({ logFilePath: path.join(__dirname, 'logs/gateway.log') }));

app.use(cookieParser());

const ALLOWED_ORIGINS = env.ALLOWED_ORIGINS;

const allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.static(path.join(__dirname, '../public')));


// Serve Swagger and ReDoc
app.use('/api-docs', swaggerUi.serve, async (req: Request, res: Response, next: NextFunction) => {
  const spec = await loadSpecs();
  swaggerUi.setup(spec)(req, res, next);
});

app.get('/docs', redoc({
  title: 'I4You Docs',
  specUrl: '/api-docs-json',
}));

app.get('/api-docs-json', async (_req, res) => {
  const spec = await loadSpecs();
  res.json(spec);
});

app.use(
  expressjwt({
    secret: env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user',
  }).unless({
    path: [
      '/',
      '/public',
      '/api/v1/auth/login',
      '/api/v1/auth/login/admin',
      '/api/v1/auth/login/google',
      '/api/v1/auth/forgot-password',
      '/api/v1/auth/reset-password',
      '/api/v1/auth/verify-account',
      '/api/v1/auth/register',
      '/api/v1/auth/refresh-token',
      '/api/v1/auth/logout',
      '/api/v1/auth/health',
      '/api/v1/user/health',
    ],
  }),
);

const createProxy = (target: string, pathRewrite: Record<string, string>) => {
  return createProxyMiddleware<Request, Response>({
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
      proxyReq: (proxyReq, req) => {
        const userId = req.user?.sub;
        if (userId) {
          proxyReq.setHeader('X-User-ID', userId);
          proxyReq.setHeader('X-User-Role', req.user?.role || 'member');
        }
      },
      proxyRes: (proxyRes, req, _res) => {
        console.log(req.url, ': Response: ', proxyRes.statusCode);
      },
      error: (err, _req, res) => {
        console.error('Proxy error:', err);
        if ('status' in res) {
          res.status(500).json({ error: 'Unexpected error' });
        }
      },
    },
  });
};

app.use('/api/v1/auth', createProxy(env.AUTH_SERVER_URL, { '^/api/v1/auth': '' }));
app.use('/api/v1/user', createProxy(env.USER_SERVER_URL, { '^/api/v1/user': '' }));

app.get('/', (_req, res) => {
  res.redirect('/api-docs');
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid or missing token' });
  } else {
    console.log('Unknown Error:', err);
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
