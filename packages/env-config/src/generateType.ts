import fs from "fs";
import path from "path";

function generateTypeDefinition(parsedConfig: Record<string, any>): string {
    const entries = Object.entries(parsedConfig)
        .map(([key, value]) => {
            let type: string;
            if (typeof value === "number") {
                type = "number";
            } else if (typeof value === "boolean") {
                type = "boolean";
            } else {
                type = "string"; // Default to string for environment variables
            }
            return `  ${key}: ${type};`;
        })
        .join("\n");

    return `export type EnvConfig = {\n${entries}\n};`;
}

export function generateEnvType(log: (...args: any[]) => void) {
    const jsonPath = path.resolve(process.cwd(), "env.config.ts");
    const distPath = process.cwd();

    log("dist ",distPath);

    if (!fs.existsSync(jsonPath)) {
        console.warn("⚠️ env.config.ts not found. Skipping type generation.");
        return;
    }

    log("📂 Generating TypeScript type from env.config.ts...");

    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const parsedConfig = JSON.parse(jsonData);

    const typeDefinition = generateTypeDefinition(parsedConfig);

    // Ensure dist folder exists
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
    }

    // Write the type definition to dist/envConfig.d.ts
    const typeFilePath = path.join(distPath, "envConfig.d.ts");
    fs.writeFileSync(typeFilePath, typeDefinition);

    log("✅ Type generated in dist/envConfig.d.ts");
}
