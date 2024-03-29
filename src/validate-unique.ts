import {
  OperationCallback,
  OperationEvent, OperationEventsEnum,
  ServiceInterface,
} from '@rxstack/platform';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {ValidateUniqueOptions} from './interfaces';
import {getProperty, restrictToOperations} from './utils';

export const validateUnique = (options: ValidateUniqueOptions): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.PRE_EXECUTE]);
    const service = event.injector.get(options.service);
    const input = event.request.body;
    const data = _.isArray(event.getData()) ? event.getData<Array<Record<string, any>>>() : [event.getData<Record<string, any>>()];
    await processUniqueValidation(service, input, data, options);
  };
};

const processUniqueValidation = async (service: ServiceInterface<any>, input: any, data: Array<Record<string, any>>,
                                          options: ValidateUniqueOptions): Promise<void> => {
  const filteredData = data.filter((v) => _.isObject(v));
  if (_.isArray(input)) {
    for (let i = 0; i < input.length; i++) {
      await validateUniqueItem(service, input[i], filteredData, options);
    }
  } else {
    await validateUniqueItem(service, input, filteredData, options);
  }
};

const validateUniqueItem = async (service: ServiceInterface<any>, input: Record<string, any>,
                                     data: Array<Record<string, any>>, options: ValidateUniqueOptions): Promise<void> => {
  const criteria = buildCriteria(input, options.properties);
  const method = options.method || 'findMany';
  const result: Record<string, any>[] = await service[method].call(service, {where: criteria, skip: 0, limit: 1});
  if (shouldThrowException(result, data, options)) {
    throwException(input, options);
  }
};

const buildCriteria = (input: Record<string, any>, properties: Array<string>): Record<string, any> => {
  const criteria = { };
  properties.forEach(field => {
    criteria[field] = { '$eq': getProperty(input, field) };
  });

  return criteria;
};

const shouldThrowException = (result: Array<Record<string, any>>, data: Array<Record<string, any>>, options: ValidateUniqueOptions): boolean => {
  return false === (result.length === 0 || exists(result[0], data, options.properties));
};

const exists = (result: Record<string, any>, data: Array<Record<string, any>>, properties: Array<string>): boolean => {
  const partialResult = _.pick(result, properties);
  return !!_.find(data, (value: Record<string, any>) => _.isEqual(partialResult, _.pick(value, properties)));
};

const throwException = (input: Record<string, any>, options: ValidateUniqueOptions): void => {
  const message = options.message || 'Value is not unique';
  const exception = new BadRequestException('Validation Failed');
  exception.data = {
    errors: [
      {
        path: options.errorPath,
        value: _.get(input, options.properties[0]),
        message: message
      }
    ]
  };
  throw exception;
};
