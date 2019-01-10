import {
  ApiOperationCallback, OperationEvent, OperationEventsEnum,
} from '@rxstack/platform';
import {UnauthorizedException} from '@rxstack/exceptions';
import {assertToken, restrictToOperations} from './utils';

export const restrictToAuthenticatedUser = (fullyAuthenticated = true): ApiOperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.INIT, OperationEventsEnum.PRE_EXECUTE]);
    const token = event.request.token;
    assertToken(token);
    if (!token.isAuthenticated() || (fullyAuthenticated && !token.isFullyAuthenticated())) {
      throw new UnauthorizedException();
    }
  };
};
