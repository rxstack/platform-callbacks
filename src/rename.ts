import {
  OperationCallback, OperationEvent,
} from '@rxstack/platform';
import * as _ from 'lodash';
import {getProperty, mapToEventData} from './utils';

export const rename = (key: string, newKey: string, dataPath?: string): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    mapToEventData(event, doRename, [key, newKey, dataPath]);
  };
};

export const doRename = (source: Record<string, any>, key: string, newKey: string, dataPath?: string): Record<string, any>|Record<string, any>[] => {
  const data = dataPath ? getProperty(source, dataPath) : source;
  const result = _.isArray(data) ? data.map((value: Record<string, any>) => doRenameItem(value, key, newKey)) :
    doRenameItem(data, key, newKey);
  return dataPath ? _.set(source, dataPath, result) : result;
};

const doRenameItem = (data: Record<string, any>, key: string, newKey: string): Record<string, any> => {
  const value = getProperty(data, key);
  _.set(data, newKey, _.clone(value));
  _.unset(data, key);
  return data;
};
