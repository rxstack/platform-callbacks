import {OperationEventsEnum} from '@rxstack/platform';
import {MethodNotAllowedException} from '@rxstack/exceptions';

export const doValidateAlterOperations = (eventType: OperationEventsEnum): void => {
  const operations = [
    OperationEventsEnum.PRE_WRITE,
    OperationEventsEnum.POST_COLLECTION_READ,
    OperationEventsEnum.POST_READ,
    OperationEventsEnum.POST_WRITE,
    OperationEventsEnum.POST_REMOVE,
  ];
  if (!operations.includes(eventType)) {
    throw new MethodNotAllowedException(`EventType ${eventType} is not supported.`);
  }
};