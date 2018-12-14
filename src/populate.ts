import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import * as _ from 'lodash';
import {PopulateSchema} from './interfaces';
import {BadRequestException, MethodNotAllowedException} from '@rxstack/exceptions';
import {Injector} from 'injection-js';

export const populate = <T>(schema: PopulateSchema<T>): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const operations = [
      OperationEventsEnum.POST_COLLECTION_READ,
      OperationEventsEnum.POST_READ,
      OperationEventsEnum.POST_WRITE,
      OperationEventsEnum.POST_REMOVE,
    ];

    if (!operations.includes(event.eventType)) {
      throw new MethodNotAllowedException(`EventType ${event.eventType} is not supported.`);
    }

    const data = event.getData();
    const result = await getResult(getIds(data, schema.parentField), schema, event.injector);
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
  const data = _.get(value, parentField);
  if (typeof data === 'undefined') {
    throw new BadRequestException(`FieldValue in path ${parentField} is undefined.`);
  }
  return _.isArray(data) ? data : [data];
};

const getResult = async <T>(ids: Array<any>, schema: PopulateSchema<T>, injector: Injector): Promise<Array<T>> => {
  const service = injector.get(schema.service);
  const defaultQuery = { where: {[schema.childField]: {'$in': ids}}, limit: ids.length, skip: 0 };
  const method = schema.method || 'findMany';
  const query = schema.query ? _.merge(defaultQuery, schema.query) : defaultQuery;
  return await service[method](query);
};

const mapResult = <T>(schema: PopulateSchema<T>, data: Object, result: T[]) => {
  const value: any | Array<any> = _.get(data, schema.parentField);
  const items = _.isArray(value) ? _.filter(result, (i) => value.includes(i[schema.childField])) :
    _.find(result, (i) => i[schema.childField] === value);
  _.set(data, schema.nameAs || schema.parentField, items);
};