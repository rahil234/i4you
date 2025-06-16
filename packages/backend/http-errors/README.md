# @I4You/http-errors

Custom HTTP Error Generator for Express.js and microservices.

## Install
```bash
npm install @i4you/http-errors
# or
yarn add @i4you/http-errors
```

## Usage
```ts
import { createError } from '@i4you/http-errors';

// Named Error
next(createError.NotFound('User not found', 'USER_NOT_FOUND'));

// Generic Error
next(createError(400, 'Bad request data', 'BAD_REQUEST'));

// Optional: Throw instead of next()
throw createError.Internal('Database error', 'DB_ERROR');
```

## Stack Trace
Clean stack traces that point directly to your code:
```ts
HttpError: Not Found
    at routeHandler (/app/routes/user.ts:10:13)
```

## API
```ts
createError(statusCode: number, message: string, errorCode?: string, data?: any)
createError.BadRequest(message?: string, errorCode?: string, data?: any)
createError.NotFound(...)
createError.Internal(...)
...
```

## License
MIT