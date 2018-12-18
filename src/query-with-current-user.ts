import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {MethodNotAllowedException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {CurrentUserOptions} from './interfaces';
import {assertToken, getProperty} from './utils';

export const queryWithCurrentUser = (options: CurrentUserOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    if (event.eventType !== OperationEventsEnum.QUERY) {
      throw new MethodNotAllowedException(`EventType ${event.eventType} is not supported.`);
    }
    options = _.merge({idField: 'id', targetField: 'userId'}, options);
    const token = event.request.token;
    assertToken(token);
    let userProp = getProperty(token.getUser(), options.idField);
    _.merge(event.request.attributes.get('query'), {where: {[options.targetField]: {'$eq': userProp}}});
  };
};
