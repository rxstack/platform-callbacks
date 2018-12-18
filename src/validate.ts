import {
  ApiOperationCallback,
  ApiOperationEvent,
  OperationEventsEnum,
  WriteOperationMetadata
} from '@rxstack/platform';
import {validate as _validate, ValidatorOptions} from 'class-validator';
import * as _ from 'lodash';
import {BadRequestException, MethodNotAllowedException} from '@rxstack/exceptions';
import {classToPlain, plainToClass} from 'class-transformer';
import {Constructable} from './interfaces';

export const validate = <T>(type: Constructable<T> | string, options?: ValidatorOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const metadata = event.metadata as WriteOperationMetadata<any>;
    if (event.eventType !== OperationEventsEnum.PRE_WRITE) {
      throw new MethodNotAllowedException('Validate callback is not supported.');
    }
    const groups = event.request.attributes.get('validation_groups');
    const input = _.isString(type) ? event.request.body : plainToClass(type, event.request.body);
    await doValidate(type, input, resolveOptions(metadata.type, groups, options));
    event.request.body = classToPlain(input);
  };
};

const resolveOptions = (type: string, groups?: Array<string>, options?: ValidatorOptions): ValidatorOptions => {
  const defaults =  {
    validationError: { target: false },
    whitelist: true,
    groups: groups,
    skipMissingProperties: type === 'PATCH'
  };
  return options ? _.merge(defaults, options) : defaults;
};

const doValidate = async <T>(type: Constructable<T> | string,
                             input: Object, options?: ValidatorOptions): Promise<void> => {
  const errors = _.isString(type) ? await _validate(type, input, options)
    : await _validate(input, options);
  if (errors.length > 0) {
    const exception = new BadRequestException('Validation Failed');
    exception.data = errors;
    throw exception;
  }
};