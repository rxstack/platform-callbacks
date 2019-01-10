import {
  ApiOperationCallback, OperationEvent,
  OperationEventsEnum
} from '@rxstack/platform';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {CurrentUserOptions} from './interfaces';
import {assertToken, getProperty, restrictToOperations} from './utils';

export const queryWithCurrentUser = (options: CurrentUserOptions): ApiOperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.INIT]);
    options = _.merge({idField: 'id', targetField: 'userId'}, options);
    const token = event.request.token;
    assertToken(token);
    let userProp = getProperty(token.getUser(), options.idField);
    const criteria = {[options.targetField]: {'$eq': userProp}};
    if (event.request.attributes.has('query')) {
      _.merge(event.request.attributes.get('query'), {where: criteria});
    } else if (event.request.attributes.has('criteria')) {
      _.merge(event.request.attributes.get('criteria'), criteria);
    } else {
      throw new BadRequestException('Query or Criteria is not set');
    }
  };
};
