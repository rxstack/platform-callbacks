import {
  ApiOperationCallback,
  ApiOperationEvent, OperationEventsEnum, RemoveOperationMetadata
} from '@rxstack/platform';
import {BadRequestException, NotFoundException} from '@rxstack/exceptions';
import * as _ from 'lodash';
import {Response} from '@rxstack/core';
import {QueryInterface} from '@rxstack/query-filter';

export interface SoftDeleteOptions {
  deleteField?: string;
}

export const softDelete = (options?: SoftDeleteOptions): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    const resolvedOptions = Object.assign({deleteField: 'deletedAt'}, options);
    switch (event.eventType) {
      case OperationEventsEnum.PRE_WRITE:
      case OperationEventsEnum.PRE_READ:
        checkObjectIfDeleted(event, resolvedOptions);
        break;
      case OperationEventsEnum.QUERY:
        onQuery(event, resolvedOptions);
        break;
      case OperationEventsEnum.PRE_REMOVE:
        checkObjectIfDeleted(event, resolvedOptions);
        await onPreRemove(event, resolvedOptions);
        break;
      default:
        throw new BadRequestException(`SoftDelete is not supported in event type ${event.eventType}`);
    }
  };
};

const onQuery = (event: ApiOperationEvent, options: SoftDeleteOptions): void => {
  const query: QueryInterface = event.request.attributes.get('query');
  _.merge(query, {where: {[options.deleteField]: {'$eq': null}}});
};

const onPreRemove = async (event: ApiOperationEvent, options: SoftDeleteOptions): Promise<void> => {
  const metadata = event.metadata as RemoveOperationMetadata<any>;
  const service = event.injector.get(metadata.service);
  const id = _.get(event.getData(), service.options.idField);
  const data = await service.updateOne(id, {[options.deleteField]: new Date()}, {patch: true});
  event.setData(data);
  event.response = new Response(null, 204);
};

const checkObjectIfDeleted = (event: ApiOperationEvent, options: SoftDeleteOptions): void => {
  if (_.isDate(_.get(event.getData(), options.deleteField))) {
    throw new NotFoundException();
  }
};