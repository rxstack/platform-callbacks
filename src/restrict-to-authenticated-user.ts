import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';

export const restrictToAuthenticatedUser = (fullyAuthenticated = true): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const operations = [
      OperationEventsEnum.PRE_WRITE,
      OperationEventsEnum.PRE_COLLECTION_READ,
      OperationEventsEnum.PRE_READ,
      OperationEventsEnum.PRE_REMOVE,
    ];
    if (!operations.includes(event.eventType)) {
      throw new MethodNotAllowedException(`EventType ${event.eventType} is not supported.`);
    }
    const token = event.request.token;
    if (!token || !token.isAuthenticated() || (fullyAuthenticated && !token.isFullyAuthenticated())) {
      throw new UnauthorizedException();
    }
  };
};
