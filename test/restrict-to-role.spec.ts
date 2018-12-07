import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {ForbiddenException, MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';
import {Token} from './mocks/shared/token';
import {restrictToRole} from '../src';

describe('PlatformCallbacks:restrict-to-role', () => {
  // Setup application
  const app = new Application(APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  after(async() =>  {
    await app.stop();
  });

  it('should pass', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    await restrictToRole('ROLE_ADMIN')(apiEvent); // do nothing
  });

  it('should throw MethodNotAllowedException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    let exception: MethodNotAllowedException;
    try {
      await restrictToRole('ROLE_ADMIN')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });

  it('should throw UnauthorizedException', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    let exception: UnauthorizedException;
    try {
      await restrictToRole('ROLE_ADMIN')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should throw ForbiddenException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    let exception: ForbiddenException;
    try {
      await restrictToRole('ROLE_USER')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(ForbiddenException);
  });

});
