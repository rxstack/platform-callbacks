import {
  ApiOperationCallback,
  OperationEvent
} from '@rxstack/platform';
import {classToPlain, ClassTransformOptions, plainToClass} from 'class-transformer';
import {Constructable} from './interfaces';
import {getSource} from './utils/get-source';
import {setSource} from './utils/set-source';

export const transform = <T>(type: Constructable<T>, options?: ClassTransformOptions): ApiOperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    const source = getSource(event);
    const data = plainToClass(type, source, { ignoreDecorators: true });
    setSource(event, classToPlain(data, options));
  };
};