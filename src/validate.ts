import {
  ApiOperationCallback,
  ApiOperationEvent,
  OperationEventsEnum,
  WriteOperationMetadata
} from '@rxstack/platform';
import {validate as _validate, ValidatorOptions} from 'class-validator';
import * as _ from 'lodash';
import {BadRequestException} from '@rxstack/exceptions';
import {classToPlain, plainToClass} from 'class-transformer';
import {Constructable} from './interfaces';

export const validate = <T>(type: Constructable<T> | string, options?: ValidatorOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const metadata = event.metadata as WriteOperationMetadata<any>;
    if (event.eventType !== OperationEventsEnum.PRE_WRITE) {
      throw new BadRequestException('Validate callback is not supported.');
    }
    const groups = event.request.attributes.get('validation_groups');
    const input = _.isString(type) ? event.request.body : plainToClass(type, event.request.body);
    const defaults =  {
      validationError: { target: false },
      whitelist: true,
      groups: groups ? groups : undefined,
      skipMissingProperties: metadata.type === 'PATCH'
    };
    const resolvedOptions = options ? _.merge(defaults, options) : defaults;
    const errors = _.isString(type) ? await _validate(type, input, resolvedOptions)
      : await _validate(input, resolvedOptions);
    if (errors.length > 0) {
      const exception = new BadRequestException('Validation Failed');
      exception.data = errors;
      throw exception;
    }
    event.request.body = classToPlain(input);
  };
};