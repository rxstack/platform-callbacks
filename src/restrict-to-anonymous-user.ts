import {OperationCallback, OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {UnauthorizedException} from '@rxstack/exceptions';
import {AnonymousToken} from '@rxstack/security';
import {restrictToOperations} from './utils';

export const restrictToAnonymousUser = (): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.PRE_EXECUTE]);
    const token = event.request.token;
    if (false === (!token || token instanceof AnonymousToken)) {
      throw new UnauthorizedException();
    }
  };
};
