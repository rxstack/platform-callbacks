import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {ForbiddenException, MethodNotAllowedException} from '@rxstack/exceptions';
import {assertToken} from './utils';

export const restrictToRole = (role: string): ApiOperationCallback => {
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
    assertToken(token);
    if (!token.hasRole(role)) {
      throw new ForbiddenException();
    }
  };
};
