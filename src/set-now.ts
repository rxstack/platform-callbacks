import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';

export const setNow = (...fieldNames: string[]): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const data = event.request.body;
    _.isArray(data) ? data.forEach((v) => doSetNow(v, fieldNames)) : doSetNow(data, fieldNames);
  };
};

const doSetNow = (data: Object, fieldNames: string[]): void => {
  if (!_.isObject(data)) {
    throw new BadRequestException('Request body should be an object');
  }
  fieldNames.forEach((path) => _.set(data, path, new Date()));
};