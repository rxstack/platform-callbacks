import {
  OperationCallback,
  OperationEvent
} from '@rxstack/platform';
import {classToPlain, ClassTransformOptions, plainToClass} from 'class-transformer';
import {getSource} from './utils/get-source';
import {setSource} from './utils/set-source';
import {Constructable} from '@rxstack/utils';

export const transform = <T>(type: Constructable<T>, options?: ClassTransformOptions): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    const source = getSource(event);
    const data = plainToClass(type, source, { ignoreDecorators: true });
    setSource(event, classToPlain(data, options));
  };
};