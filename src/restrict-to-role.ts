import {
  ApiOperationCallback,
  OperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {ForbiddenException} from '@rxstack/exceptions';
import {assertToken, restrictToOperations} from './utils';

export const restrictToRole = (role: string): ApiOperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.INIT, OperationEventsEnum.PRE_EXECUTE]);
    const token = event.request.token;
    assertToken(token);
    if (!token.hasRole(role)) {
      throw new ForbiddenException();
    }
  };
};
