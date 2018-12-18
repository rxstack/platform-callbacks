import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {
  ForbiddenException
} from '@rxstack/exceptions';
import {CurrentUserOptions} from './interfaces';
import * as _ from 'lodash';
import {assertToken, getProperty, restrictToPreOperations} from './utils';

export const restrictToOwner = (options?: CurrentUserOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    restrictToPreOperations(event.eventType);
    const token = event.request.token;
    assertToken(token);
    options = _.merge({idField: 'id', targetField: 'userId'}, options);
    const userProp = getProperty(token.getUser(), options.idField);
    const data = event.getData();
    _.isArray(data) ? data.forEach((v) => checkData(v, userProp, options.targetField)) :
      checkData(data, userProp, options.targetField);
  };
};

const checkData = (data: Object, userProp: any, targetField: string): void => {
  const targetId = _.get(data, targetField);
  if (userProp !== targetId) {
    throw new ForbiddenException();
  }
};