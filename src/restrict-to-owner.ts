import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {
  BadRequestException,
  ForbiddenException,
  MethodNotAllowedException,
  UnauthorizedException
} from '@rxstack/exceptions';
import {CurrentUserOptions} from './interfaces';
import * as _ from 'lodash';

export const restrictToOwner = (options?: CurrentUserOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const operations = [
      OperationEventsEnum.PRE_WRITE,
      OperationEventsEnum.PRE_READ,
      OperationEventsEnum.PRE_REMOVE
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
    const targetId = _.get(event.getData(), options.targetField);
    if (userId !== targetId) {
      throw new ForbiddenException();
    }
  };
};
