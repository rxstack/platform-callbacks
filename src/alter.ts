import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import * as _ from 'lodash';
import {AlterMethod} from './interfaces';

export const alter = (methodName: AlterMethod, ...fieldName: string[]): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const method = methodName === 'pick' ? _.pick : _.omit;
    let data = event.getData();
    if (_.isArray(data)) {
      data.forEach((value: Object, key: number) => {
        data[key] = method(value, fieldName);
      });
    } else {
      data = method(data, fieldName);
    }
    event.setData(data);
  };
};