import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_create_metadata} from './mocks/shared/app.metadata';
import {BadRequestException, MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';
import {Token} from './mocks/shared/token';
import {associateWithCurrentUser} from '../src/associate-with-current-user';
import * as _ from 'lodash';

describe('PlatformCallbacks:associate-with-current-user', () => {
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

  it('should associate with current user on object', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = {};
    await associateWithCurrentUser({idField: 'username'})(apiEvent);
    request.body['userId'].should.be.equal('admin');
  });

  it('should associate with current user on array of objects', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = [{}, {}];
    await associateWithCurrentUser({idField: 'username'})(apiEvent);
    _.forEach(request.body, (item) => item['userId'].should.be.equal('admin'));
  });

  it('should throw MethodNotAllowedException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    let exception: MethodNotAllowedException;
    try {
      await associateWithCurrentUser({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });

  it('should throw UnauthorizedException', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    let exception: UnauthorizedException;
    try {
      await associateWithCurrentUser({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should throw BadRequestException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    let exception: BadRequestException;
    try {
      await associateWithCurrentUser({idField: 'unknown'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });
});
