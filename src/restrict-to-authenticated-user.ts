import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';
import {assertToken} from './utils';

export const restrictToAuthenticatedUser = (fullyAuthenticated = true): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    validateEventTypeOperation(event.eventType);
    const token = event.request.token;
    assertToken(token);
    if (!token.isAuthenticated() || (fullyAuthenticated && !token.isFullyAuthenticated())) {
      throw new UnauthorizedException();
    }
  };
};

const validateEventTypeOperation = (eventType: OperationEventsEnum): void => {
  const operations = [
    OperationEventsEnum.PRE_COLLECTION_READ,
    OperationEventsEnum.PRE_WRITE,
    OperationEventsEnum.PRE_READ,
    OperationEventsEnum.PRE_REMOVE,
  ];
  if (!operations.includes(eventType)) {
    throw new MethodNotAllowedException(`EventType ${eventType} is not supported.`);
  }
};
