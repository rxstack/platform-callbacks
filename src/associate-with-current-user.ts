import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {
  BadRequestException,
  MethodNotAllowedException,
  UnauthorizedException
} from '@rxstack/exceptions';
import {CurrentUserOptions} from './interfaces';
import {OperationEventsEnum} from '@rxstack/platform/dist/enums';
import * as _ from 'lodash';

export const associateWithCurrentUser = (options: CurrentUserOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const operations = [
      OperationEventsEnum.PRE_WRITE
    ];
    if (!operations.includes(event.eventType)) {
      throw new MethodNotAllowedException(`EventType ${event.eventType} is not supported.`);
    }
    const token = event.request.token;
    if (!token) {
      throw new UnauthorizedException();
    }
    options = _.merge({idField: 'id', targetField: 'userId'}, options);
    const userId = _.get(token.getUser(), options.idField);
    if (!userId) {
      throw new BadRequestException(`Current user is missing '${options.idField}' field.`);
    }
    _.isArray(event.request.body) ?
      _.forEach(event.request.body, (item) => _.set(item, options.targetField, userId)) :
    _.set(event.request.body, options.targetField, userId);
  };
};
