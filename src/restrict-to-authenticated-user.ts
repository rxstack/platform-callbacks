import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {UnauthorizedException} from '@rxstack/exceptions';
import {assertToken, restrictToPreOperations} from './utils';

export const restrictToAuthenticatedUser = (fullyAuthenticated = true): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    restrictToPreOperations(event.eventType);
    const token = event.request.token;
    assertToken(token);
    if (!token.isAuthenticated() || (fullyAuthenticated && !token.isFullyAuthenticated())) {
      throw new UnauthorizedException();
    }
  };
};
