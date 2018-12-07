import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import * as _ from 'lodash';
import {PopulateSchema} from './interfaces';
import {BadRequestException} from '@rxstack/exceptions';

export const populate = <T>(schema: PopulateSchema<T>): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const data = event.getData();
    const ids: any[] = [];

    _.isArray(data) ? data.forEach(value => ids.push(...getIds(value, schema.parentField)))
      : ids.push(...getIds(data, schema.parentField));

    const uniqueIds = [...new Set(ids)];
    const service = event.injector.get(schema.service);
    const defaultQuery = { where: {[schema.childField]: {'$in': uniqueIds}}, limit: uniqueIds.length, skip: 0 };
    const method = schema.method || 'findMany';
    const query = schema.query ? _.merge(defaultQuery, schema.query) : defaultQuery;
    const result = await service[method](query);

    _.isArray(data) ? data.forEach(value => mapResult<T>(schema, value, result)) : mapResult<T>(schema, data, result);
    event.setData(data);
  };
};

const getIds = (value: Object, parentField: string): any[] => {
  const data = _.get(value, parentField);
  if (typeof data === 'undefined') {
    throw new BadRequestException(`FieldValue in path ${parentField} is undefined.`);
  }
  return _.isArray(data) ? data : [data];
};

const mapResult = <T>(schema: PopulateSchema<T>, data: Object, result: T[]) => {
  const value: any | any[] = _.get(data, schema.parentField);
  const items = _.isArray(value) ? _.filter(result, (i) => value.includes(i[schema.childField])) :
    _.find(result, (i) => i[schema.childField] === value);
  _.set(data, schema.nameAs || schema.parentField, items);
};