import {
  OperationCallback,
  OperationEvent
} from '@rxstack/platform';
import * as _ from 'lodash';
import {getSource} from './utils';

export const setNow = (...fieldNames: string[]): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    const data = getSource(event);
    _.isArray(data) ? data.map((v) => doSetNow(v, fieldNames)) : doSetNow(data, fieldNames);
  };
};

const doSetNow = (data: Object, fieldNames: Array<string>): void =>
  fieldNames.forEach((path) => _.set(data, path, new Date()));