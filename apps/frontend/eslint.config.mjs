import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    {
        ignores: [
            "public/**",
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
        ],
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': [
                'warn',
                {
                    bracketSpacing: true,
                    singleQuote: true,
                    semi: true,
                    trailingComma: 'es5',
                    tabWidth: 4,
                    printWidth: 80,
                },
            ],
        }
    },
];

export default eslintConfig;
