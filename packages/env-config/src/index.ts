import dotenv from 'dotenv';

dotenv.config(); // Load from .env

// Define types
export type EnvConfig<T extends Record<string, string>> = {
  [K in keyof T]: string;
};

type SetupEnvOptions = {
  debug?: boolean;
};

// Logger setup
let debug = true;
const log = (...args: any[]) => {
  if (debug) console.log(...args);
};

let envConfig: EnvConfig<any> | null = null;
let setupCompleted = false;

// Main function
export function setupEnvConfig<T extends Record<string, string>>(
  config: T,
  options?: SetupEnvOptions,
): { [K in keyof T]: string } {
  if (setupCompleted) {
    console.warn('⚠️ setupEnvConfig is already initialized.');
    return envConfig as EnvConfig<T>;
  }

  debug = options?.debug ?? true;
  log('🚀 Setting up envConfig...');
  log('Required envs:', config);

  const missingKeys = Object.keys(config).filter((key) => !process.env[config[key]]);
  if (missingKeys.length > 0) {
    throw new Error(`Missing environment variables: ${missingKeys.join(', ')}`);
  }

  const result = {} as { [K in keyof T]: string };
  Object.keys(config).forEach((key) => {
    Object.defineProperty(result, key, {
      get: () => process.env[config[key]] || '',
      enumerable: true,
    });
  });

  envConfig = result;
  setupCompleted = true;

  log('✅ envConfig initialized.');
  return result;
}

export function getEnvConfig<T extends Record<string, string>>(): EnvConfig<T> {
  if (!envConfig) {
    throw new Error('envConfig is not initialized. Call setupEnvConfig() first.');
  }
  return envConfig as EnvConfig<T>;
}