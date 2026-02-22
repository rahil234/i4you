import createError from 'http-errors';

/**
 * Default export (for generic usage)
 */
export default createError;

/**
 * Named exports for clean ESM usage
 */
export const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  UnprocessableEntity,
  InternalServerError,
  BadGateway,
  NotImplemented,
  ServiceUnavailable,
  HttpError
} = createError;

/**
 * Re-export type
 */
export type HttpError = ReturnType<typeof createError>;
