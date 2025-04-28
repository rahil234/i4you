import env from '@/config/env.config';
import '@/config/grpc.server';

interface Config {
  env: typeof env;
}

const config: Config = {
  env,
};

export { env };

export default config;
