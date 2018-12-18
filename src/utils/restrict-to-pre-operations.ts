import {OperationEventsEnum} from '@rxstack/platform';
import {MethodNotAllowedException} from '@rxstack/exceptions';

export const restrictToPreOperations = (eventType: OperationEventsEnum): void => {
  const operations = [
    OperationEventsEnum.PRE_WRITE,
    OperationEventsEnum.PRE_COLLECTION_READ,
    OperationEventsEnum.PRE_READ,
    OperationEventsEnum.PRE_REMOVE,
  ];
  if (!operations.includes(eventType)) {
    throw new MethodNotAllowedException(`EventType ${eventType} is not supported.`);
  }
};