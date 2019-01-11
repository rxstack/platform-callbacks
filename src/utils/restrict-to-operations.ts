import {OperationEventsEnum} from '@rxstack/platform';
import {MethodNotAllowedException} from '@rxstack/exceptions';

export const restrictToOperations = (eventType: OperationEventsEnum, operations: OperationEventsEnum[]): void => {
  if (!operations.includes(eventType)) {
    throw new MethodNotAllowedException(`EventType ${eventType} is not supported.`);
  }
};