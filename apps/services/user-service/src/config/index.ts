import env from '@/config/env.config';

interface Config {
  env: typeof env;
}

const config: Config = {
  env
};

export { env };

export default config;
