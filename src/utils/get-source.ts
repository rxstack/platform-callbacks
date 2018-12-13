import {ApiOperationEvent, OperationEventsEnum} from '@rxstack/platform';

export const getSource = (event: ApiOperationEvent): Object[]|Object => {
  return event.eventType === OperationEventsEnum.PRE_WRITE ? event.request.body : event.getData();
};