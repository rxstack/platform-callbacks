import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {alter} from './alter';

export const discard = (fieldNames: string[], propertyPath?: string): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => await alter('omit', fieldNames, propertyPath)(event);
};
