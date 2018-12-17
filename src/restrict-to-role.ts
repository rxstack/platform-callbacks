import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {ForbiddenException, MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';
import {assertToken} from './utils';

export const restrictToRole = (role: string): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    validateEventTypeOperation(event.eventType);
    const token = event.request.token;
    assertToken(token);
    if (!token.hasRole(role)) {
      throw new ForbiddenException();
    }
  };
};

const validateEventTypeOperation = (eventType: OperationEventsEnum): void => {
  const operations = [
    OperationEventsEnum.PRE_WRITE,
    OperationEventsEnum.PRE_COLLECTION_READ,
    OperationEventsEnum.PRE_READ,
    OperationEventsEnum.PRE_REMOVE,
  ];
  if (!operations.includes(eventType)) {
    throw new MethodNotAllowedException(`EventType ${eventType} is not supported.`);
  }
};
