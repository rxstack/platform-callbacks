import {
  OperationCallback,
  OperationEvent, OperationEventsEnum,
  ServiceInterface,
} from '@rxstack/platform';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {ValidateUniqueOptions} from './interfaces';
import {restrictToOperations} from './utils';

export const validateUnique = <T>(options: ValidateUniqueOptions): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.PRE_EXECUTE]);
    const service = event.injector.get(options.service);
    const input = event.request.body;
    const data = _.isArray(event.getData()) ? event.getData<Array<Object>>() : [event.getData<Object>()];
    await processUniqueValidation(service, input, data, options);
  };
};

const processUniqueValidation = async (service: ServiceInterface<any>, input: any, data: Array<Object>,
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

const validateUniqueItem = async (service: ServiceInterface<any>, input: Object,
                                     data: Array<Object>, options: ValidateUniqueOptions): Promise<void> => {
  const criteria = buildCriteria(input, options.properties);
  const method = options.method || 'findMany';
  const result: Object[] = await service[method].call(service, {where: criteria, skip: 0, limit: 1});
  if (shouldThrowException(result, data, options)) {
    throwException(input, options);
  }
};

const buildCriteria = (input: Object, properties: Array<string>): Object => {
  const criteria = { };
  properties.forEach(field => {
    const value = _.get(input, field);
    if (!value) {
      throw new BadRequestException(`ValidateUnique : missing property: ${field}`);
    }
    criteria[field] = { '$eq': value };
  });

  return criteria;
};

const shouldThrowException = (result: Array<Object>, data: Array<Object>, options: ValidateUniqueOptions): boolean => {
  return false === (result.length === 0 || exists(result[0], data, options.properties));
};

const exists = (result: Object, data: Array<Object>, properties: Array<string>): boolean => {
  const partialResult = _.pick(result, properties);
  return !!_.find(data, (value: Object) => _.isEqual(partialResult, _.pick(value, properties)));
};

const throwException = (input: Object, options: ValidateUniqueOptions): void => {
  const message = options.message || 'validation.not_unique';
  const exception = new BadRequestException('Validation Failed');
  exception.data = [
    {
      target: null,
      property: options.propertyPath,
      value: _.get(input, options.properties[0]),
      constraints: {
        'unique': message
      },
      children: []
    }
  ];
  throw exception;
};