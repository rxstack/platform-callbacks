import {ApplicationOptions} from '@rxstack/core';
import {environmentPlatform} from './environment.platform';
import {PlatformModule} from '@rxstack/platform';
import {NoopService} from './noop.service';

export const APP_OPTIONS: ApplicationOptions = {
  imports: [
    PlatformModule
  ],
  providers: [
    { provide: NoopService, useClass: NoopService },
  ],
  servers: environmentPlatform.servers
};