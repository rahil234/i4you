# env-config

**@rahil234/env-config** is a utility package for loading environment variables and providing appropriate getters for them.

## Features

- Load environment variables from `.env` files.
- validate environment variables against a configuration schema.
- Provide type-safe getters for environment variables.
- Simplify environment variable management in your projects.

## Installation

```bash
npm install @rahil234/env-config

yarn add @rahil234/env-config

pnpm add @rahil234/env-config

bun add @rahil234/env-config
```

## Usage

Create a .env file in the root of your project:

```plaintext
PORT=3000
DATABASE_URL=mongodb://localhost:27017/mydb
```

also create an env-config.ts file in the root of your project:
```typescript
{
  "NODE_ENV": "NODE_ENV", 
  "PORT": "PORT"
}
```

Use the env-config package in your project:

```javascript
import { getEnv } from 'env-config';

const env = getEnv();

console.log(`Server running on port: ${env.port}`);
console.log(`Database URL: ${env.databaseUrl}`);
```

If the specified environment variables are not set, the package will throw an error with a detailed message.

## License

This project is licensed under the ISC License.

## Author

rahil234