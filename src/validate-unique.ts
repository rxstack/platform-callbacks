import {
  ApiOperationCallback,
  ApiOperationEvent,
  OperationEventsEnum,
  WriteOperationMetadata
} from '@rxstack/platform';
import {BadRequestException} from '@rxstack/exceptions';
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
      throw new BadRequestException('ValidateUnique callback is not supported.');
    }
    const data = event.getData();
    const criteria = buildCriteria(event.request.body, options.properties);

    const method = options.method || 'findMany';
    const service = event.injector.get(metadata.service);
    const result: Object[] = await service[method].call(service, {where: criteria, skip: 0, limit: 1});

    if (shouldThrowException(result, data, options)) {
      throwException(data, options);
    }
  };
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

const shouldThrowException = (result: Array<Object>, data: Object, options: ValidateUniqueOptions): boolean => {
  return result.length === 0 || (_.isObject(data) && result.length === 1 && hasDifference(data, result[0], options));
}

const hasDifference = (data: Object, result: Object, options: ValidateUniqueOptions): boolean => {
  return _.difference(
    _.values(_.pick(result, options.properties)),
    _.values(_.pick(data, options.properties))
  ).length  < options.properties.length;
};

const throwException = (data: Object, options: ValidateUniqueOptions): void => {
  const message = options.message || 'validation.not_unique';
  const exception = new BadRequestException('Validation Failed');
  exception.data = [
    {
      target: null,
      property: options.propertyPath,
      value: _.isObject(data) ? data[options.properties[0]] : undefined,
      constraints: {
        'unique': message
      },
      children: []
    }
  ];
  throw exception;
};