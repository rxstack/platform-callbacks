import {AlterMethod} from '../interfaces';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {PartialDeep} from '@rxstack/utils';

export const doAlter = (
  source: Object,
  methodName: AlterMethod,
  fieldNames: string[],
  propertyPath?: string): PartialDeep<Object>|PartialDeep<Object>[] => {
  const method = methodName === 'pick' ? _.pick : _.omit;
  const data = propertyPath ? _.get(source, propertyPath) : source;
  if (!data) {
    throw new BadRequestException('Source in doAlter is not valid.');
  }
  const result = _.isArray(data) ? data.map((value: Object) => method(value, fieldNames)) :
    method(data, fieldNames);

  return propertyPath ? _.set(source, propertyPath, result) : result;
};