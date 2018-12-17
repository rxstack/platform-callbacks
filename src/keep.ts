import {
  ApiOperationCallback,
  ApiOperationEvent
} from '@rxstack/platform';
import {alter} from './alter';

export const keep = (fieldNames: string[], propertyPath?: string): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => await alter('pick', fieldNames, propertyPath)(event);
};
