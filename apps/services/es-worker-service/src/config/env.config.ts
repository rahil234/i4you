import {setupEnvConfig} from '@i4you/env-config';
import {env as config} from '../env.config';

export const env = setupEnvConfig(config, {debug: false});

export default env;
