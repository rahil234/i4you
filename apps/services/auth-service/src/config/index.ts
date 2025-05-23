import { Secret, SignOptions } from 'jsonwebtoken';
import env from '@/config/env.config';

type JWTExpiresIn = SignOptions['expiresIn'];

interface Config {
  env: typeof env;
  jwtSecret: Secret;
  jwtExpiresIn: JWTExpiresIn;
}

const config: Config = {
  env,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN as JWTExpiresIn,
};

export { env };

export default config;
