import env from '@/config/env.config';

interface Config {
    env: typeof env;
}

const config: Config = {
    env,
}

export {env};

// const jwtSecret = process.env.JWT_SECRET;
// const USER_SERVER_URL = process.env.USER_SERVER_URL;
// const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;
// const PORT = process.env.PORT;
// const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

export default config;