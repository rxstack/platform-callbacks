import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {BadRequestException} from '@rxstack/exceptions';
import {classToPlain, ClassTransformOptions, plainToClass} from 'class-transformer';
import {Constructable} from './interfaces';
import * as _ from 'lodash';

export const transform = <T>(type: Constructable<T>, options?: ClassTransformOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    if (!(_.isObject(event.getData()) || _.isArray(event.getData()))) {
      throw new BadRequestException('event.getData() should return an object or an array.');
    }
    const groups = event.request.attributes.get('serialization_groups');
    const input = plainToClass(type, event.getData(), { ignoreDecorators: true });
    event.setData(classToPlain(input, Object.assign({ groups: groups }, options)));
  };
};