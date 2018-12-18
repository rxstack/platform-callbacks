import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {
  ForbiddenException,
  MethodNotAllowedException
} from '@rxstack/exceptions';
import {CurrentUserOptions} from './interfaces';
import * as _ from 'lodash';
import {assertToken, getProperty} from './utils';

export const restrictToOwner = (options?: CurrentUserOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    validateEventTypeOperation(event.eventType);
    const token = event.request.token;
    assertToken(token);
    options = _.merge({idField: 'id', targetField: 'userId'}, options);
    const userProp = getProperty(token.getUser(), options.idField);
    const targetId = _.get(event.getData(), options.targetField);
    if (userProp !== targetId) {
      throw new ForbiddenException();
    }
  };
};

const validateEventTypeOperation = (eventType: OperationEventsEnum): void => {
  const operations = [
    OperationEventsEnum.PRE_WRITE,
    OperationEventsEnum.PRE_READ,
    OperationEventsEnum.PRE_REMOVE,
  ];
  if (!operations.includes(eventType)) {
    throw new MethodNotAllowedException(`EventType ${eventType} is not supported.`);
  }
};
