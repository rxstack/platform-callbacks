import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_create_metadata, app_get_metadata} from './mocks/shared/app.metadata';
import {doRename, rename} from '../src';
import {BadRequestException, MethodNotAllowedException} from '@rxstack/exceptions';

describe('PlatformCallbacks:rename', () => {
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

  it('should rename a property in data object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData({'_id': 1});
    await rename('_id', 'id')(apiEvent);
    const expected = '{"id":1}';
    JSON.stringify(apiEvent.getData()).should.be.equal(expected);
  });


  it('should rename a property in array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData([
      {'_id': 1},
      {'_id': 2},
    ]);
    await rename('_id', 'id')(apiEvent);
    const expected = '[{"id":1},{"id":2}]';
    JSON.stringify(apiEvent.getData()).should.be.equal(expected);
  });

  it('should rename a property in object with propertyPath', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData({'user': {
      '_id': 'id'
      }});
    await rename('_id', 'id', 'user')(apiEvent);
    const expected = '{"user":{"id":"id"}}';
    JSON.stringify(apiEvent.getData()).should.be.equal(expected);
  });

  it('should rename a property in array of object with propertyPath', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData({'users': [
        { '_id': 1 },
        { '_id': 2 },
    ]});
    await rename('_id', 'id', 'users')(apiEvent);
    const expected = '{"users":[{"id":1},{"id":2}]}';
    JSON.stringify(apiEvent.getData()).should.be.equal(expected);
  });

  it('should throw MethodNotAllowedException on invalid type', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    let exception: MethodNotAllowedException;
    try {
      await rename('_id', 'id')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });

  it('should throw BadRequestException on invalid source', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    let exception: BadRequestException;
    try {
      await rename('_id', 'id')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });

  it('should throw BadRequestException on invalid key', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = {};
    let exception: BadRequestException;
    try {
      await rename('_id', 'id')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });

  it('should rename using doRename', async () => {
    const data = [
      {
        '_id': 1,
        'items': [
          {'_id': 1},
          {'_id': 2},
        ]
      },
      {
        '_id': 1,
        'items': [
          {'_id': 1},
          {'_id': 2},
        ]
      }
    ];

    data.forEach(value => {
      doRename(value, '_id', 'id');
      doRename(value.items, '_id', 'id');
    });
    const expected = '[{"items":[{"id":1},{"id":2}],"id":1},{"items":[{"id":1},{"id":2}],"id":1}]';
    JSON.stringify(data).should.be.equal(expected);
  });
});
