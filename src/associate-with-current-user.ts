import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {
  MethodNotAllowedException,
} from '@rxstack/exceptions';
import {CurrentUserOptions} from './interfaces';
import {OperationEventsEnum} from '@rxstack/platform/dist/enums';
import * as _ from 'lodash';
import {assertToken, getProperty} from './utils';

export const associateWithCurrentUser = (options: CurrentUserOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    validateEventTypeOperation(event.eventType);
    const token = event.request.token;
    assertToken(token);
    options = _.merge({idField: 'id', targetField: 'userId'}, options);
    const userId = getProperty(token.getUser(), options.idField);
    _.isArray(event.request.body) ?
      _.forEach(event.request.body, (item) => _.set(item, options.targetField, userId)) :
    _.set(event.request.body, options.targetField, userId);
  };
};

const validateEventTypeOperation = (eventType: OperationEventsEnum): void => {
  const operations = [
    OperationEventsEnum.PRE_WRITE
  ];
  if (!operations.includes(eventType)) {
    throw new MethodNotAllowedException(`EventType ${eventType} is not supported.`);
  }
};
