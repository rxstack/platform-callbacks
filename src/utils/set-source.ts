import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';

export const setSource = (event: OperationEvent, data: any): void => {
  event.eventType === OperationEventsEnum.PRE_EXECUTE ? event.request.body = data : event.setData(data);
};