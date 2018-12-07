import {TaskModel} from '../validate/task.model';
import {
  GetOperationMetadata,
  ListOperationMetadata,
  RemoveOperationMetadata,
  WriteOperationMetadata
} from '@rxstack/platform';
import {NoopService} from './noop.service';

export const app_create_metadata: WriteOperationMetadata<TaskModel> = {
  name: 'app_task',
  transports: ['SOCKET'],
  type: 'POST',
  service: NoopService,
};

export const app_list_metadata: ListOperationMetadata<TaskModel> = {
  name: 'app_list',
  transports: ['HTTP', 'SOCKET'],
  service: NoopService,
};

export const app_get_metadata: GetOperationMetadata<TaskModel> = {
  name: 'app_get',
  transports: ['HTTP', 'SOCKET'],
  service: NoopService,
};

export const app_remove_metadata: RemoveOperationMetadata<TaskModel> = {
  name: 'app_remove',
  transports: ['HTTP', 'SOCKET'],
  service: NoopService,
};