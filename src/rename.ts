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

export const doRename = (source: Object, key: string, newKey: string, dataPath?: string): Object|Object[] => {
  const data = dataPath ? getProperty(source, dataPath) : source;
  const result = _.isArray(data) ? data.map((value: Object) => doRenameItem(value, key, newKey)) :
    doRenameItem(data, key, newKey);
  return dataPath ? _.set(source, dataPath, result) : result;
};

const doRenameItem = (data: Object, key: string, newKey: string): Object => {
  const value = getProperty(data, key);
  _.set(data, newKey, _.clone(value));
  _.unset(data, key);
  return data;
};