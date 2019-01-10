import {
  ApiOperationCallback,
  OperationEvent,
  OperationEventsEnum,
} from '@rxstack/platform';
import {validate as _validate, ValidatorOptions} from 'class-validator';
import * as _ from 'lodash';
import {BadRequestException} from '@rxstack/exceptions';
import {classToPlain, plainToClass} from 'class-transformer';
import {Constructable} from './interfaces';
import {restrictToOperations} from './utils';

export const validate = <T>(type: Constructable<T> | string, options?: ValidatorOptions): ApiOperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.PRE_EXECUTE]);
    event.request.body = await processData(event.request.body, type, resolveOptions(options));
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

const resolveOptions = (options?: ValidatorOptions): ValidatorOptions => {
  const defaults =  {
    validationError: { target: false },
    whitelist: true,
    skipMissingProperties: false
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