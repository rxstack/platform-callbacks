import {TaskModel} from '../validate/task.model';
import {
  ResourceOperationMetadata, ResourceOperationTypesEnum
} from '@rxstack/platform';
import {NoopService} from './noop.service';

export const app_create_metadata: ResourceOperationMetadata<TaskModel> = {
  type: ResourceOperationTypesEnum.CREATE,
  name: 'app_create',
  transports: ['SOCKET'],
  service: NoopService,
};

export const app_update_metadata: ResourceOperationMetadata<TaskModel> = {
  type: ResourceOperationTypesEnum.UPDATE,
  name: 'app_update',
  transports: ['SOCKET'],
  service: NoopService,
};

export const app_list_metadata: ResourceOperationMetadata<TaskModel> = {
  type: ResourceOperationTypesEnum.LIST,
  name: 'app_list',
  transports: ['HTTP', 'SOCKET'],
  service: NoopService,
};

export const app_get_metadata: ResourceOperationMetadata<TaskModel> = {
  type: ResourceOperationTypesEnum.GET,
  name: 'app_get',
  transports: ['HTTP', 'SOCKET'],
  service: NoopService,
};

export const app_patch_metadata: ResourceOperationMetadata<TaskModel> = {
  type: ResourceOperationTypesEnum.PATCH,
  name: 'app_patch',
  transports: ['SOCKET'],
  service: NoopService,
};

export const app_remove_metadata: ResourceOperationMetadata<TaskModel> = {
  type: ResourceOperationTypesEnum.REMOVE,
  name: 'app_remove',
  transports: ['HTTP', 'SOCKET'],
  service: NoopService,
};

export const app_bulk_create_metadata: ResourceOperationMetadata<TaskModel> = {
  type: ResourceOperationTypesEnum.BULK_CREATE,
  name: 'app_bulk_create',
  transports: ['SOCKET'],
  service: NoopService,
};