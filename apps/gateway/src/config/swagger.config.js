"use strict";
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
exports.loadSpecs = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("@/config/index");
let combinedSpec = {};
const loadSpecs = () => __awaiter(void 0, void 0, void 0, function* () {
    if (Object.keys(combinedSpec).length > 0)
        return combinedSpec;
    const [auth, user] = yield Promise.all([
        axios_1.default.get(`${index_1.env.AUTH_SERVER_URL}/api-docs-json`),
        axios_1.default.get(`${index_1.env.USER_SERVER_URL}/api-docs-json`),
    ]);
    combinedSpec = {
        openapi: '3.0.0',
        info: {
            title: 'I4You API',
            version: '1.0.0',
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        paths: Object.assign(Object.assign({}, auth.data.paths), user.data.paths),
        components: Object.assign(Object.assign(Object.assign({}, auth.data.components), user.data.components), { securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            } }),
    };
    return combinedSpec;
});
exports.loadSpecs = loadSpecs;
