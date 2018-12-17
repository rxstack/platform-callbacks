import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';
import {assertToken} from './utils';

export const restrictToAuthenticatedUser = (fullyAuthenticated = true): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const operations = [
      OperationEventsEnum.PRE_COLLECTION_READ,
      OperationEventsEnum.PRE_WRITE,
      OperationEventsEnum.PRE_READ,
      OperationEventsEnum.PRE_REMOVE,
    ];
    if (!operations.includes(event.eventType)) {
      throw new MethodNotAllowedException(`EventType ${event.eventType} is not supported.`);
    }
    const token = event.request.token;
    assertToken(token);
    if (!token.isAuthenticated() || (fullyAuthenticated && !token.isFullyAuthenticated())) {
      throw new UnauthorizedException();
    }
  };
};
