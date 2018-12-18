import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_create_metadata, app_get_metadata, app_remove_metadata} from './mocks/shared/app.metadata';
import {MethodNotAllowedException, NotFoundException} from '@rxstack/exceptions';
import {softDelete} from '../src/soft-delete';

describe('PlatformCallbacks:soft-delete', () => {
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

  it('should skip not deleted object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;

    await softDelete()(apiEvent);
    (typeof apiEvent.getData() === 'undefined').should.be.equal(true); // nothing should happen
  });

  it('@pre_read should throw an exception if object is deleted', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    apiEvent.setData({'deletedAt': new Date()});
    let exception: NotFoundException;

    try {
      await softDelete()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(NotFoundException);
  });

  it('@on_query should modify the query', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.QUERY;
    request.attributes.set('query', {where: {id: {'$eq': 1}}});
    await softDelete()(apiEvent);

    const expected = '{"where":{"id":{"$eq":1},"deletedAt":{"$eq":null}}}';
    JSON.stringify(request.attributes.get('query')).should.be.equal(expected);
  });

  it('@pre_remove should patch the object and return response with status code 204', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_remove_metadata, OperationTypesEnum.REMOVE);
    apiEvent.eventType = OperationEventsEnum.PRE_REMOVE;
    apiEvent.setData({});
    await softDelete()(apiEvent);
    apiEvent.response.statusCode.should.be.equal(204);
  });

  it('should throw MethodNotAllowedException if event type is not supported', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData({'deletedAt': new Date()});
    let exception: MethodNotAllowedException;

    try {
      await softDelete()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});

