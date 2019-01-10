import {OperationEventsEnum} from '@rxstack/platform';
import {MethodNotAllowedException} from '@rxstack/exceptions';

export const restrictToOperations = (eventType: string, operations: OperationEventsEnum[]): void => {
  if (!operations.includes(eventType as OperationEventsEnum)) {
    throw new MethodNotAllowedException(`EventType ${eventType} is not supported.`);
  }
};