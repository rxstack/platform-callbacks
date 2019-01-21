import {
  OperationCallback, OperationEvent,
} from '@rxstack/platform';
import * as _ from 'lodash';
import {BadRequestException} from '@rxstack/exceptions';
import {mapToEventData} from './utils';

export const rename = (key: string, newKey: string, propertyPath?: string): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    mapToEventData(event, doRename, [key, newKey, propertyPath]);
  };
};

export const doRename = (source: Object, key: string, newKey: string, propertyPath?: string): Object|Object[] => {
  const data = propertyPath ? _.get(source, propertyPath) : source;
  if (!data) {
    throw new BadRequestException('doRename: source is not valid');
  }
  const result = _.isArray(data) ? data.map((value: Object) => doRenameItem(value, key, newKey)) :
    doRenameItem(data, key, newKey);
  return propertyPath ? _.set(source, propertyPath, result) : result;
};

const doRenameItem = (data: Object, key: string, newKey: string): Object => {
  const value = _.get(data, key);
  if (!value) {
    throw new BadRequestException(`Current object is missing '${key}' field.`);
  }
  _.set(data, newKey, _.clone(value));
  _.unset(data, key);
  return data;
};