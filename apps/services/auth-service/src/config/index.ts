import env from '@/config/env.config';
import {PrivateKey, Secret, SignOptions} from 'jsonwebtoken';

interface Config {
    env: typeof env;
    jwtSecret: Secret | PrivateKey;
    jwtExpiresIn: SignOptions["expiresIn"];
}

const config = {
    env,
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
};

export {env};

export default config;
