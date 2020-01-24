import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {restrictToAnonymousUser} from '../src';
import {AnonymousToken} from '@rxstack/security';
import {Token} from './mocks/shared/token';
import {UnauthorizedException} from '@rxstack/exceptions';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);

describe('PlatformCallbacks:restrict-to-anonymous-user', () => {

  it('should pass anonymous user', async () => {
    const request = new Request('HTTP');
    request.token = new AnonymousToken();
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await restrictToAnonymousUser()(apiEvent); // do nothing
  });

  it('should throw an exception', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    let exception: UnauthorizedException;
    try {
      await restrictToAnonymousUser()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

});
