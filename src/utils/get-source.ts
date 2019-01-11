import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';

export const getSource = (event: OperationEvent): Object[]|Object => {
  return [OperationEventsEnum.PRE_EXECUTE].includes(event.eventType)
    ? event.request.body : event.getData();
};