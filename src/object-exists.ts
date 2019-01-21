import {
  OperationCallback, OperationEvent, OperationEventsEnum,
} from '@rxstack/platform';
import * as _ from 'lodash';
import {Injector} from 'injection-js';
import {getProperty, restrictToOperations} from './utils';
import {BadRequestException} from '@rxstack/exceptions';
import {ObjectExistSchema} from './interfaces';

export const objectExists = <T>(schema: ObjectExistSchema<T>): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.PRE_EXECUTE]);
    await processData(event.request.body, schema, event.injector);
  };
};

const processData = async <T>(input: any, schema: ObjectExistSchema<T>, injector: Injector) => {
  if (_.isArray(input)) {
    for (let i = 0; i < input.length; i++) {
      await objectExistsItem(input[i], schema, injector);
    }
  } else {
    await objectExistsItem(input, schema, injector);
  }
};

const objectExistsItem = async <T>(source: Object, schema: ObjectExistSchema<T>, injector: Injector): Promise<void> => {
  const data = schema.dataPath ? getProperty(source, schema.dataPath) : source;
  if (_.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      await checkExists(data[i], schema, injector);
    }
  } else {
    await checkExists(data, schema, injector);
  }
};

const checkExists = async <T>(data: Object, schema: ObjectExistSchema<T>, injector: Injector): Promise<void> => {
  const id = getProperty(data, schema.parentField);
  const service = injector.get(schema.service);
  const defaultCriteria = {[schema.childField]: {'$eq': id}};
  const method = schema.method || 'findOne';
  const criteria = schema.criteria ? _.merge(defaultCriteria, schema.criteria) : defaultCriteria;
  const result = await service[method](criteria);
  if (!result) {
    throw new BadRequestException('Resource does not exist');
  }
};

