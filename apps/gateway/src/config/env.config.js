"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const env_config_1 = require("env-config");
const env_config_2 = require("../env.config");
exports.env = (0, env_config_1.setupEnvConfig)(env_config_2.env, { debug: false });
exports.default = exports.env;
