import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {ForbiddenException} from '@rxstack/exceptions';
import {assertToken, restrictToPreOperations} from './utils';

export const restrictToRole = (role: string): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    restrictToPreOperations(event.eventType);
    const token = event.request.token;
    assertToken(token);
    if (!token.hasRole(role)) {
      throw new ForbiddenException();
    }
  };
};
