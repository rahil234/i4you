"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = __importStar(require("node:path"));
const redoc_express_1 = __importDefault(require("redoc-express"));
const express_jwt_1 = require("express-jwt");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("@/config");
const express_logr_1 = __importDefault(require("express-logr"));
const swagger_config_1 = require("@/config/swagger.config");
const app = (0, express_1.default)();
app.use((0, express_logr_1.default)());
app.use((0, express_logr_1.default)({ logFilePath: path.join(__dirname, 'logs/gateway.log') }));
app.use((0, cookie_parser_1.default)());
const ALLOWED_ORIGINS = config_1.env.ALLOWED_ORIGINS;
const allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.static(path.join(__dirname, '../public')));
// Serve Swagger and ReDoc
app.use('/api-docs', swagger_ui_express_1.default.serve, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const spec = yield (0, swagger_config_1.loadSpecs)();
    swagger_ui_express_1.default.setup(spec)(req, res, next);
}));
app.get('/docs', (0, redoc_express_1.default)({
    title: 'I4You Docs',
    specUrl: '/api-docs-json',
}));
app.get('/api-docs-json', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const spec = yield (0, swagger_config_1.loadSpecs)();
    res.json(spec);
}));
app.use((0, express_jwt_1.expressjwt)({
    secret: config_1.env.JWT_SECRET,
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
}));
const createProxy = (target, pathRewrite) => {
    return (0, http_proxy_middleware_1.createProxyMiddleware)({
        target,
        changeOrigin: true,
        pathRewrite,
        on: {
            proxyReq: (proxyReq, req) => {
                var _a, _b;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub;
                if (userId) {
                    proxyReq.setHeader('X-User-ID', userId);
                    proxyReq.setHeader('X-User-Role', ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) || 'member');
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
app.use('/api/v1/auth', createProxy(config_1.env.AUTH_SERVER_URL, { '^/api/v1/auth': '' }));
app.use('/api/v1/user', createProxy(config_1.env.USER_SERVER_URL, { '^/api/v1/user': '' }));
app.get('/', (_req, res) => {
    res.redirect('/api-docs');
});
app.use((err, _req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid or missing token' });
    }
    else {
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
const PORT = config_1.env.PORT;
app.listen(PORT, () => {
    console.log(`Reverse proxy with JWT validation running on port ${PORT}`);
});
