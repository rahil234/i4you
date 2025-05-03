import { ForbiddenError } from './ForbiddenError';

export class SuspendedUserError extends ForbiddenError {
  constructor() {
    super('Your account has been suspended. Please contact support.');
  }
}