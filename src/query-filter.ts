import {
  OperationCallback,
  OperationEvent, OperationEventsEnum
} from '@rxstack/platform';
import {queryFilter as q, QueryFilterSchema} from '@rxstack/query-filter';
import * as _ from 'lodash';
import {restrictToOperations} from './utils';
import {MethodNotAllowedException} from '@rxstack/exceptions';

export const queryFilter = (schema: QueryFilterSchema): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.PRE_EXECUTE]);
    if (!event.request.attributes.has('query')) {
      throw new MethodNotAllowedException('Query does not exist.');
    }
    const query = q.createQuery(schema, event.request.params.toObject());
    _.merge(event.request.attributes.get('query'), query);
  };
};

