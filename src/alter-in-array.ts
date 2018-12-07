import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {AlterMethod} from './interfaces';

const doAlter = (methodName: AlterMethod, data: Object, arrayName: string, ...fieldName: string[]): Object => {
  const arrayValue = data[arrayName];
  if (!_.isArray(arrayValue)) {
    throw new BadRequestException(`The field ${arrayName} should be an array.`);
  }
  const method = methodName === 'pick' ? _.pick : _.omit;
  arrayValue.forEach((v: Object, key: number) => {
    arrayValue[key] = method(v, fieldName);
  });
  return arrayValue;
};

export const alterInArray = (methodName: AlterMethod, arrayName: string, ...fieldName: string[]): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    let data = event.getData();
    if (_.isArray(data)) {
      data.forEach((value: Object, key: number) => {
        data[key][arrayName] = doAlter(methodName, value, arrayName, ...fieldName);
      });
    } else {
      data[arrayName] = doAlter(methodName, data, arrayName, ...fieldName);
    }
    event.setData(data);
  };
};