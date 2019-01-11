import {
  OperationCallback, OperationEvent,
} from '@rxstack/platform';
import {CurrentUserOptions} from './interfaces';
import {OperationEventsEnum} from '@rxstack/platform/dist/enums';
import * as _ from 'lodash';
import {assertToken, getProperty, restrictToOperations} from './utils';

export const associateWithCurrentUser = (options: CurrentUserOptions): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.PRE_EXECUTE]);
    const token = event.request.token;
    assertToken(token);
    options = _.merge({idField: 'id', targetField: 'userId'}, options);
    const userId = getProperty(token.getUser(), options.idField);
    _.isArray(event.request.body) ?
      _.forEach(event.request.body, (item) => _.set(item, options.targetField, userId)) :
    _.set(event.request.body, options.targetField, userId);
  };
};
