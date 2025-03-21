import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {generateEnvType} from "./generateType";
import {EnvConfig} from "../dist/envConfig";

dotenv.config(); // Load from .env first

let envConfig: EnvConfig | null = null;

// Define a logger function
const log = (...args: any[]) => {
    if (debug) console.log(...args);
};

// Function to load environment variables from .env.config.json
export function loadEnvFromJson(): EnvConfig {
    const jsonPath = path.resolve(process.cwd(), "env.config.json");

    if (!fs.existsSync(jsonPath)) {
        console.warn("⚠️ env.config.json not found. Skipping JSON config.");
        return {} as EnvConfig;
    }

    log("📂 Loading environment variables from env.config.json...");

    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const parsedConfig: EnvConfig = JSON.parse(jsonData);

    log("✅ env.config.json variables loaded.", parsedConfig);

    return parsedConfig;
}

// Define options type
type SetupEnvOptions = {
    debug?: boolean;
};

let setupCompleted = false;

let debug = false;

// Function to validate and create envConfig dynamically
export function setupEnvConfig(
    requiredEnvsOrOptions?: EnvConfig | SetupEnvOptions,
    options?: SetupEnvOptions
) {
    if (setupCompleted) {
        console.warn("⚠️ setupEnvConfig is already initialized.");
        return envConfig as EnvConfig;
    }

    // If the first argument is missing, or it's an options object, shift parameters
    let requiredEnvs: any;
    let configOptions: SetupEnvOptions;

    if (!requiredEnvsOrOptions || "debug" in requiredEnvsOrOptions) {
        requiredEnvs = loadEnvFromJson(); // Default to loading from JSON
        configOptions = requiredEnvsOrOptions as SetupEnvOptions ?? {debug: true};
    } else {
        requiredEnvs = requiredEnvsOrOptions as any;
        configOptions = options ?? {debug: true};
    }

    debug = configOptions.debug ?? true;

    // Generate TypeScript type before importing
    generateEnvType(log);

    log("🚀 Setting up envConfig...");
    log("Required envs:", requiredEnvs);

    const missingEnvVars = Object.keys(requiredEnvs).filter((envKey) => !process.env[envKey]);

    if (missingEnvVars.length > 0) {
        throw new Error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
    }

    log("✅ All required environment variables are set.");

    envConfig = Object.create(null) as EnvConfig;

    Object.keys(requiredEnvs).forEach((envKey) => {
        Object.defineProperty(envConfig!, envKey, {
            get: () => process.env[envKey] || "",
            enumerable: true,
        });
    });

    setupCompleted = true;
    log("✅ envConfig initialized.");
    return envConfig as EnvConfig;
}

export function getEnvConfig(): EnvConfig {
    log("🔍 Getting envConfig...");
    if (!envConfig) {
        throw new Error("envConfig is not initialized. Call setupEnvConfig() first.");
    }
    return envConfig as EnvConfig;
}
