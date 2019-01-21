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
    await processData(objectExistsItem, event.request.body, schema, event.injector);
  };
};

const objectExistsItem = async <T>(source: Object, schema: ObjectExistSchema<T>, injector: Injector): Promise<void> => {
  const data = schema.dataPath ? getProperty(source, schema.dataPath) : source;
  await processData(validateObject, data, schema, injector);
};

const validateObject = async <T>(data: Object, schema: ObjectExistSchema<T>, injector: Injector): Promise<void> => {
  const id = getProperty(data, schema.targetField);
  const service = injector.get(schema.service);
  const defaultCriteria = {[schema.inverseField]: {'$eq': id}};
  const method = schema.method || 'findOne';
  const criteria = schema.criteria ? _.merge(defaultCriteria, schema.criteria) : defaultCriteria;
  const result = await service[method](criteria);
  if (!result) {
    throw new BadRequestException('Resource does not exist');
  }
};

const processData = async <T>(func: Function, input: any, schema: ObjectExistSchema<T>, injector: Injector) => {
  if (_.isArray(input)) {
    for (let i = 0; i < input.length; i++) {
      await func(input[i], schema, injector);
    }
  } else {
    await func(input, schema, injector);
  }
};

