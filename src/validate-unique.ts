import {
  ApiOperationCallback,
  ApiOperationEvent,
  OperationEventsEnum,
  OperationTypesEnum,
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
    if (event.type !== OperationTypesEnum.WRITE || event.eventType !== OperationEventsEnum.PRE_WRITE) {
      throw new BadRequestException('ValidateUnique callback is not supported.');
    }
    const data = event.getData();
    const body = _.isObject(event.request.body) ? event.request.body : { };
    const criteria = { };

    options.properties.forEach(field => {
      if (!body[field]) {
        throw new BadRequestException(`ValidateUnique : missing property: ${field}`);
      }
      criteria[field] = { '$eq': body[field] };
    });

    const message: string = options.message || 'validation.not_unique';
    const method = options.method || 'findMany';
    const service = event.injector.get(metadata.service);
    const result: Object[] = await service[method].call(service, {where: criteria, skip: 0, limit: 1});

    if (false === (result.length === 0 || (_.isObject(data) && result.length === 1 && _.difference(
      _.values(_.pick(result[0], options.properties)),
      _.values(_.pick(data, options.properties))
    ).length < options.properties.length))) {
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
    }
  };
};