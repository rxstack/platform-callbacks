import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {classToPlain, ClassTransformOptions, plainToClass} from 'class-transformer';
import {Constructable} from './interfaces';
import {getSource} from './utils/get-source';
import {setSource} from './utils/set-source';
import {doValidateAlterOperations} from './utils/do-validate-alter-operations';

export const transform = <T>(type: Constructable<T>, options?: ClassTransformOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    doValidateAlterOperations(event.eventType);
    const source = getSource(event);
    const data = plainToClass(type, source, { ignoreDecorators: true });
    const groups = event.request.attributes.get('serialization_groups');
    setSource(event, classToPlain(data, Object.assign({ groups: groups }, options)));
  };
};