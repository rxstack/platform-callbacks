import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';

export const getSource = (event: OperationEvent): Object[]|Object => {
  return [OperationEventsEnum.INIT, OperationEventsEnum.PRE_EXECUTE].includes(event.eventType as OperationEventsEnum)
    ? event.request.body : event.getData();
};