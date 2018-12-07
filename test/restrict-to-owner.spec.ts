import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {
  BadRequestException,
  Exception,
  ForbiddenException,
  MethodNotAllowedException,
  UnauthorizedException
} from '@rxstack/exceptions';
import {restrictToOwner} from '../src/restrict-to-owner';
import {Token} from './mocks/shared/token';

describe('PlatformCallbacks:restrict-to-owner', () => {
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
    apiEvent.setData({
      'userId': 'admin'
    });
    await restrictToOwner({idField: 'username'})(apiEvent); // do nothing
  });

  it('should throw ForbiddenException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    apiEvent.setData(undefined);
    let exception: ForbiddenException;
    try {
      await restrictToOwner({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(ForbiddenException);
  });

  it('should throw MethodNotAllowedException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(undefined);
    let exception: MethodNotAllowedException;
    try {
      await restrictToOwner({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });

  it('should throw UnauthorizedException', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    apiEvent.setData(undefined);
    let exception: UnauthorizedException;
    try {
      await restrictToOwner({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should throw BadRequestException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    apiEvent.setData(undefined);
    let exception: BadRequestException;
    try {
      await restrictToOwner({idField: 'unknown'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });
});
