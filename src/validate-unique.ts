import {
  ApiOperationCallback,
  ApiOperationEvent,
  OperationEventsEnum, ServiceInterface,
  WriteOperationMetadata
} from '@rxstack/platform';
import {BadRequestException, MethodNotAllowedException} from '@rxstack/exceptions';
import * as _ from 'lodash';

export interface ValidateUniqueOptions {
  properties: string[];
  propertyPath: string;
  method?: string;
  message?: string;
}

export const validateUnique = (options: ValidateUniqueOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const metadata = event.metadata as WriteOperationMetadata<any>;
    if (event.eventType !== OperationEventsEnum.PRE_WRITE) {
      throw new MethodNotAllowedException('ValidateUnique callback is not supported.');
    }
    const input = event.request.body;
    const data = _.isArray(event.getData()) ? event.getData<Array<Object>>() : [event.getData<Object>()];
    const filteredData = data.filter((v) => _.isObject(v));
    const service = event.injector.get(metadata.service);
    if (_.isArray(input)) {
      for (let i = 0; i < input.length; i++) {
        await validateUniqueItem(service, input[i], filteredData, options);
      }
    } else {
      await validateUniqueItem(service, input, filteredData, options);
    }
  };
};

const validateUniqueItem = async <T>(service: ServiceInterface<T>, input: Object,
                                     data: Array<Object>, options: ValidateUniqueOptions): Promise<void> => {
  const criteria = buildCriteria(input, options.properties);
  const method = options.method || 'findMany';
  const result: Object[] = await service[method].call(service, {where: criteria, skip: 0, limit: 1});
  if (shouldThrowException(result, data, options)) {
    throwException(input, options);
  }
};

const buildCriteria = (data: Object, properties: Array<string>): Object => {
  const criteria = { };
  properties.forEach(field => {
    const value = _.get(data, field);
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