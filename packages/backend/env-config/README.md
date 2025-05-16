# env-config

**env-config** is a utility package for loading environment variables and providing appropriate getters for them.

## Features

- Load environment variables from `.env` files.
- Provide type-safe getters for environment variables.
- Simplify environment variable management in your projects.

## Installation

```bash
npm install env-config

yarn add env-config

pnpm add env-config

bun add env-config
```

## Usage

Create a .env file in the root of your project:
PORT=3000
DATABASE_URL=mongodb://localhost:27017/mydb

Use the env-config package in your project:

```javascript
import { getEnv } from 'env-config';

const port = getEnv('PORT');
const databaseUrl = getEnv('DATABASE_URL');

console.log(`Server running on port: ${port}`);
console.log(`Database URL: ${databaseUrl}`);
```

## License

This project is licensed under the ISC License.

## Author

rahil234