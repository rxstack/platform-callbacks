import {ApplicationOptions} from '@rxstack/core';
import {PlatformModule} from '@rxstack/platform';
import {UserService} from './user.service';
import {environmentPlatform} from '../shared/environment.platform';

export const POPULATE_OPTIONS: ApplicationOptions = {
  imports: [
    PlatformModule
  ],
  providers: [
    { provide: UserService, useClass: UserService },
  ],
  servers: environmentPlatform.servers,
  logger: environmentPlatform.logger
};