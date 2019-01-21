import {
  OperationCallback, OperationEvent,
  OperationEventsEnum
} from '@rxstack/platform';
import * as _ from 'lodash';
import {PopulateSchema} from './interfaces';
import {Injector} from 'injection-js';
import {getProperty, restrictToOperations} from './utils';

export const populate = <T>(schema: PopulateSchema<T>): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.POST_EXECUTE]);
    const data = event.getData();
    const result = await getResult(getIds(data, schema.targetField), schema, event.injector);
    _.isArray(data) ? data.map(value => mapResult<T>(schema, value, result))
      : mapResult<T>(schema, data, result);
  };
};

const getIds = (data: Object|Array<Object>, parentField: string): Array<any> => {
  const ids: Array<any> = [];
  _.isArray(data) ? data.forEach(value => ids.push(...getItemIds(value, parentField)))
    : ids.push(...getItemIds(data, parentField));
  return[...new Set(ids)];
};

const getItemIds = (value: Object, parentField: string): Array<any> => {
  const data = getProperty(value, parentField);
  return _.isArray(data) ? data : [data];
};

const getResult = async <T>(ids: Array<any>, schema: PopulateSchema<T>, injector: Injector): Promise<Array<T>> => {
  const service = injector.get(schema.service);
  const defaultQuery = { where: {[schema.inverseField]: {'$in': ids}}, limit: ids.length, skip: 0 };
  const method = schema.method || 'findMany';
  const query = schema.query ? _.merge(defaultQuery, schema.query) : defaultQuery;
  return await service[method](query);
};

const mapResult = <T>(schema: PopulateSchema<T>, data: Object, result: T[]) => {
  const value: any | Array<any> = _.get(data, schema.targetField);
  const items = _.isArray(value) ? _.filter(result, (i) => value.includes(i[schema.inverseField])) :
    _.find(result, (i) => i[schema.inverseField] === value);
  _.set(data, schema.nameAs || schema.targetField, items);
};