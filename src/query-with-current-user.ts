import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {BadRequestException, MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {CurrentUserOptions} from './interfaces';

export const queryWithCurrentUser = (options: CurrentUserOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    if (event.eventType !== OperationEventsEnum.QUERY) {
      throw new MethodNotAllowedException(`EventType ${event.eventType} is not supported.`);
    }
    options = _.merge({idField: 'id', targetField: 'userId'}, options);
    const token = event.request.token;
    if (!token || !token.isAuthenticated()) {
      throw new UnauthorizedException();
    }
    let userId = _.get(token.getUser(), options.idField);
    if (!userId) {
      throw new BadRequestException(`Current user is missing ${options.idField}`);
    }
    _.merge(event.request.attributes.get('query'), {where: {[options.targetField]: {'$eq': userId}}});
  };
};
