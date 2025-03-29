import {setupEnvConfig,getEnvConfig} from "@repo/env-config";

setupEnvConfig({debug: false});

export const env = getEnvConfig();

export default env;