import {ApplicationOptions} from '@rxstack/core';
import {PlatformModule} from '@rxstack/platform';
import {environmentPlatform} from '../shared/environment.platform';
import {UserService} from './user.service';

export const OBJECT_EXISTS_OPTIONS: ApplicationOptions = {
  imports: [
    PlatformModule
  ],
  providers: [
    { provide: UserService, useClass: UserService },
  ],
  servers: environmentPlatform.servers
};