import {
  OperationCallback,
  OperationEvent, OperationEventsEnum, ResourceOperationMetadata, ResourceOperationTypesEnum, ServiceInterface
} from '@rxstack/platform';
import {MethodNotAllowedException, NotFoundException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {Response} from '@rxstack/core';
import {restrictToOperations} from './utils';
import {SoftDeleteOptions} from './interfaces';

export const softDelete = (options?: SoftDeleteOptions): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    restrictToOperations(event.eventType, [OperationEventsEnum.PRE_EXECUTE]);
    options = _.merge({deleteField: 'deletedAt', addOnCreate: false}, options);
    const metadata = event.metadata as ResourceOperationMetadata<any>;
    const service = event.injector.get(metadata.service);

    switch (metadata.type) {
      case ResourceOperationTypesEnum.CREATE:
      case ResourceOperationTypesEnum.BULK_CREATE:
        addDeleteField(event, options);
        break;
      case ResourceOperationTypesEnum.LIST:
      case ResourceOperationTypesEnum.PATCH:
      case ResourceOperationTypesEnum.BULK_REMOVE:
        modifyCriteria(event, options);
        break;
      case ResourceOperationTypesEnum.UPDATE:
      case ResourceOperationTypesEnum.GET:
        validateObject(event, options);
        break;
      case ResourceOperationTypesEnum.REMOVE:
        validateObject(event, options);
        await handleRemove(event, options, service);
        break;
    }
  };
};

const addDeleteField = (event: OperationEvent, options: SoftDeleteOptions): void => {
  if (options.addOnCreate) {
    const data = event.request.body;
    _.isArray(data) ? data.forEach((v) => _.set(v, options.deleteField, null))
      : _.set(data, options.deleteField, null);
  }
};

const modifyCriteria = (event: OperationEvent, options: SoftDeleteOptions): void => {
  const q: Record<string, any> = {[options.deleteField]: {'$eq': null}};
  if (event.request.attributes.has('query')) {
    _.merge(event.request.attributes.get('query'), {where: q});
  } else if (event.request.attributes.has('criteria')) {
    _.merge(event.request.attributes.get('criteria'), q);
  } else {
    throw new MethodNotAllowedException(`Query or Criteria are not set in ${event.metadata.name}`);
  }
};

const validateObject = (event: OperationEvent, options: SoftDeleteOptions): void => {
  if (_.isDate(_.get(event.getData(), options.deleteField))) {
    throw new NotFoundException();
  }
};

const handleRemove = async (event: OperationEvent, options: SoftDeleteOptions, service: ServiceInterface<any>): Promise<void> => {
  const id = _.get(event.getData(), service.options.idField);
  const data = _.merge(event.getData(), {[options.deleteField]: new Date()});
  await service.updateOne(id, data);
  event.response = new Response(null, 204);
};
