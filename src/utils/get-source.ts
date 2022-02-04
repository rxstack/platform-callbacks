import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';

export const getSource = (event: OperationEvent): Record<string, any>[]|Record<string, any> => {
  return [OperationEventsEnum.PRE_EXECUTE].includes(event.eventType)
    ? event.request.body : event.getData();
};
