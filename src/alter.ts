import {
  OperationCallback,
  OperationEvent
} from '@rxstack/platform';
import {doAlter} from './utils/do-alter';
import {AlterMethod} from './interfaces';
import {mapEvent} from './utils';

export const alter = (methodName: AlterMethod, fieldNames: string[], propertyPath?: string): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    mapEvent(event, doAlter, [methodName, fieldNames, propertyPath]);
  };
};

