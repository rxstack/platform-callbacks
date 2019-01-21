import {
  OperationCallback,
  OperationEvent
} from '@rxstack/platform';
import {doAlter} from './utils/do-alter';
import {AlterMethod} from './interfaces';
import {mapToEventData} from './utils';

export const alter = (methodName: AlterMethod, fieldNames: string[], dataPath?: string): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    mapToEventData(event, doAlter, [methodName, fieldNames, dataPath]);
  };
};

