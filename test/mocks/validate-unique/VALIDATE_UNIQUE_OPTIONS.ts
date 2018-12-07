import {ApplicationOptions} from '@rxstack/core';
import {environmentPlatform} from '../shared/environment.platform';
import {PlatformModule} from '@rxstack/platform';
import {TaskService} from './task.service';

export const VALIDATE_UNIQUE_OPTIONS: ApplicationOptions = {
  imports: [
    PlatformModule
  ],
  providers: [
    { provide: TaskService, useClass: TaskService },
  ],
  servers: environmentPlatform.servers,
  logger: environmentPlatform.logger
};