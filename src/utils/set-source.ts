import {ApiOperationEvent, OperationEventsEnum} from '@rxstack/platform';

export const setSource = (event: ApiOperationEvent, data: any): void => {
  event.eventType === OperationEventsEnum.PRE_WRITE ? event.request.body = data : event.setData(data);
};