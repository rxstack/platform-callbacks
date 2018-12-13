import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import * as _ from 'lodash';
import {BadRequestException} from '@rxstack/exceptions';
import {doValidateAlterOperations} from './utils/do-validate-alter-operations';
import {getSource} from './utils/get-source';
import {setSource} from './utils/set-source';

export const rename = (key: string, newKey: string, propertyPath?: string): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    doValidateAlterOperations(event.eventType);
    const source = getSource(event);
    const data = _.isArray(source) ? source.map(value => doRename(value, key, newKey, propertyPath)) :
      doRename(source, key, newKey, propertyPath);
    setSource(event, data);
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
    throw new BadRequestException(`Object with key ${key} does not exist.`);
  }
  _.set(data, newKey, _.clone(value));
  _.unset(data, key);
  return data;
};