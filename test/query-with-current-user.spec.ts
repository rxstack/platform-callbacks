import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_get_metadata, app_list_metadata} from './mocks/shared/app.metadata';
import {
  BadRequestException,
  Exception,
  ForbiddenException,
  MethodNotAllowedException,
  UnauthorizedException
} from '@rxstack/exceptions';
import {Token} from './mocks/shared/token';
import {queryWithCurrentUser} from '../src';

describe('PlatformCallbacks:query-with-current-user', () => {
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

  it('should add userId to the query', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.QUERY;
    request.attributes.set('query', {where: {id: {'$gt': 1}}});
    await queryWithCurrentUser({idField: 'username'})(apiEvent);
    const expected = '{"where":{"id":{"$gt":1},"userId":{"$eq":"admin"}}}';
    JSON.stringify(request.attributes.get('query')).should.be.equal(expected);
  });

  it('should throw MethodNotAllowedException', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.PRE_COLLECTION_READ;
    let exception: MethodNotAllowedException;
    try {
      await queryWithCurrentUser({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });

  it('should throw UnauthorizedException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    request.token.setAuthenticated(false);
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.QUERY;
    let exception: UnauthorizedException;
    try {
      await queryWithCurrentUser({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should throw BadRequestException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.QUERY;
    let exception: BadRequestException;
    try {
      await queryWithCurrentUser({idField: 'unknown'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });
});
