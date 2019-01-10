import {
  ApiOperationCallback,
  OperationEvent, OperationEventsEnum, ResourceOperationMetadata, ResourceOperationTypesEnum
} from '@rxstack/platform';
import {MethodNotAllowedException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {Response} from '@rxstack/core';
import {restrictToOperations} from './utils';

export interface SoftDeleteOptions {
  deleteField?: string;
}

export const softDelete = (options?: SoftDeleteOptions): ApiOperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.INIT, OperationEventsEnum.PRE_EXECUTE]);
    options = _.merge({deleteField: 'deletedAt'}, options);
    if (event.eventType === OperationEventsEnum.INIT) {
      modifyCriteria(event, options);
    } else {
      await handleRemove(event, options);
    }
  };
};

const modifyCriteria = (event: OperationEvent, options: SoftDeleteOptions): void => {
  const q: Object = {[options.deleteField]: {'$eq': null}};
  if (event.request.attributes.has('query')) {
    _.merge(event.request.attributes.get('query'), {where: q});
  } else if (event.request.attributes.has('criteria')) {
    _.merge(event.request.attributes.get('criteria'), q);
  } else {
    throw new MethodNotAllowedException(`Query or Criteria are not set in ${event.metadata.name}`);
  }
};

const handleRemove = async (event: OperationEvent, options: SoftDeleteOptions): Promise<void> => {
  const metadata = event.metadata as ResourceOperationMetadata<any>;
  if (metadata.type !== ResourceOperationTypesEnum.REMOVE) {
    throw new MethodNotAllowedException(`SoftDelete is supported only in REMOVE operation`);
  }
  const service = event.injector.get(metadata.service);
  const id = _.get(event.getData(), service.options.idField);
  const data = _.merge(event.getData(), {[options.deleteField]: new Date()});
  await service.updateOne(id, data);
  event.response = new Response(null, 204);
};