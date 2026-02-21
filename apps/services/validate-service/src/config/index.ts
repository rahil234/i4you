import { Secret } from 'jsonwebtoken';
import env from '@/config/env.config';

interface Config {
  env: typeof env;
  jwtSecret: Secret;
}

const config: Config = {
  env,
  jwtSecret: env.JWT_SECRET,
};

export { env };

export default config;
