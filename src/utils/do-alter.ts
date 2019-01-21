import {AlterMethod} from '../interfaces';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {PartialDeep} from '@rxstack/utils';
import {getProperty} from './get-property';

export const doAlter = (
  source: Object,
  methodName: AlterMethod,
  fieldNames: string[],
  dataPath?: string): PartialDeep<Object>|PartialDeep<Object>[] => {

  const data = dataPath ? getProperty(source, dataPath) : source;
  const result = _.isArray(data) ? data.map((value: Object) => applyAlter(value, methodName, fieldNames)) :
    applyAlter(data, methodName, fieldNames);

  return dataPath ? _.set(source, dataPath, result) : result;
};

const applyAlter = (value: Object, methodName: AlterMethod, fieldNames: string[]): PartialDeep<Object> => {
  const method = methodName === 'pick' ? _.pick : _.omit;
  if (!_.isObject(value)) {
    throw new BadRequestException('Value should be an object.');
  }
  return method(value, fieldNames);
};