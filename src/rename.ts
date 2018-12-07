import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import * as _ from 'lodash';
import {BadRequestException, MethodNotAllowedException} from '@rxstack/exceptions';

export const rename = (key: string, newKey: string, propertyPath?: string): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const operations = [
      OperationEventsEnum.PRE_WRITE,
      OperationEventsEnum.POST_COLLECTION_READ,
      OperationEventsEnum.POST_READ,
      OperationEventsEnum.POST_REMOVE,
    ];
    if (!operations.includes(event.eventType)) {
      throw new MethodNotAllowedException(`EventType ${event.eventType} is not supported.`);
    }
    const source = event.eventType === OperationEventsEnum.PRE_WRITE ? event.request.body : event.getData();
    _.isArray(source) ? source.map(value => doRename(value, key, newKey, propertyPath)) :
      doRename(source, key, newKey, propertyPath);
  };
};

export const doRename = (source: Object, key: string, newKey: string, propertyPath?: string): Object|Object[] => {
  const data = propertyPath ? _.get(source, propertyPath) : source;
  if (!data) {
    throw new BadRequestException('Source is not valid');
  }
  return _.isArray(data) ? data.map((value: Object) => doRenameItem(value, key, newKey)) :
    doRenameItem(data, key, newKey);
};

const doRenameItem = (data: Object, key: string, newKey: string): Object => {
  const value = _.get(data, key);
  if (!value) {
    throw new BadRequestException(`Object with key ${key} does not exist.`);
  }
  _.set(data, newKey, _.clone(value));
  _.unset(data, key);
  return data;
};