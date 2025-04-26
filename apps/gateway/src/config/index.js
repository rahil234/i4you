"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const env_config_1 = __importDefault(require("@/config/env.config"));
exports.env = env_config_1.default;
const config = {
    env: env_config_1.default,
};
// const jwtSecret = process.env.JWT_SECRET;
// const USER_SERVER_URL = process.env.USER_SERVER_URL;
// const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;
// const PORT = process.env.PORT;
// const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
exports.default = config;
