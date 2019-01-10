import {ResourceOperationMetadata, ResourceOperationTypesEnum} from '@rxstack/platform';
import {TaskService} from './task.service';
import {Task} from './task';

export const app_task_metadata: ResourceOperationMetadata<Task> = {
  name: 'app_task',
  transports: ['SOCKET'],
  type: ResourceOperationTypesEnum.GET,
  service: TaskService,
};