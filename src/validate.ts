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
    const resolvedOptions = resolveOptions(metadata.type, event.request.attributes.get('validation_groups'), options);
    event.request.body = await processData(event.request.body, type, resolvedOptions);
  };
};

const processData = async <T>(data: any, type: Constructable<T> | string,
                              options?: ValidatorOptions): Promise<any> => {
  if (_.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = await validateItem(data[i], type, options);
    }
  } else {
    data = await validateItem(data, type, options);
  }
  return data;
};

const validateItem = async <T>(data: Object, type: Constructable<T> | string,
                               options?: ValidatorOptions): Promise<Object> => {
  const input = _.isString(type) ? data : plainToClass(type, data);
  await doValidate(type, input, options);
  return classToPlain(input);
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