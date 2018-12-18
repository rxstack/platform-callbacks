import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import * as _ from 'lodash';
import {getSource} from './utils';
import {MethodNotAllowedException} from '@rxstack/exceptions';

export const setNow = (...fieldNames: string[]): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    if (event.eventType === OperationEventsEnum.QUERY) {
      throw new MethodNotAllowedException(`EventType ${event.eventType} is not supported.`);
    }
    const data = getSource(event);
    _.isArray(data) ? data.map((v) => doSetNow(v, fieldNames)) : doSetNow(data, fieldNames);
  };
};

const doSetNow = (data: Object, fieldNames: Array<string>): void =>
  fieldNames.forEach((path) => _.set(data, path, new Date()));