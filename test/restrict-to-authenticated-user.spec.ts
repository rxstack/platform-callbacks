import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';
import {Token} from './mocks/shared/token';
import {restrictToAuthenticatedUser} from '../src';

describe('PlatformCallbacks:restrict-to-authenticated-user', () => {
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

  it('should pass fully authenticated user', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    await restrictToAuthenticatedUser()(apiEvent); // do nothing
  });

  it('should pass authenticated user', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    request.token.setFullyAuthenticated(false);
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    await restrictToAuthenticatedUser(false)(apiEvent); // do nothing
  });

  it('should throw MethodNotAllowedException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    let exception: MethodNotAllowedException;
    try {
      await restrictToAuthenticatedUser()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });

  it('should throw UnauthorizedException if user is not authenticated', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    request.token.setAuthenticated(false);
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    let exception: UnauthorizedException;
    try {
      await restrictToAuthenticatedUser()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user is not fully authenticated', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    request.token.setFullyAuthenticated(false);
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    let exception: UnauthorizedException;
    try {
      await restrictToAuthenticatedUser()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should throw UnauthorizedException without token', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    let exception: UnauthorizedException;
    try {
      await restrictToAuthenticatedUser()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });
});
