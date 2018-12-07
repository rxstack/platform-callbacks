import {WriteOperationMetadata} from '@rxstack/platform';
import {TaskService} from './task.service';
import {Task} from './task';

export const app_task_metadata: WriteOperationMetadata<Task> = {
  name: 'app_task',
  transports: ['SOCKET'],
  type: 'POST',
  service: TaskService,
};