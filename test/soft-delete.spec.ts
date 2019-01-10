import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_get_metadata, app_list_metadata, app_remove_metadata} from './mocks/shared/app.metadata';
import {MethodNotAllowedException} from '@rxstack/exceptions';
import {softDelete} from '../src/soft-delete';
import * as _ from 'lodash';

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

  it('@init should modify criteria', async () => {
    const request = new Request('HTTP');
    request.attributes.set('criteria', {'id': {'$eq': 1}});
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.INIT;
    await softDelete()(apiEvent);
    const expected = JSON.parse('{ "id": { "$eq": 1 }, "deletedAt": { "$eq": null } }');
    _.isEqual(request.attributes.get('criteria'), expected).should.be.equal(true);
  });

  it('@init should modify the query', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_list_metadata);
    apiEvent.eventType = OperationEventsEnum.INIT;
    request.attributes.set('query', {where: {id: {'$eq': 1}}});
    await softDelete()(apiEvent);

    const expected = JSON.parse('{"where":{"id":{"$eq":1},"deletedAt":{"$eq":null}}}');
    _.isEqual(request.attributes.get('query'), expected).should.be.equal(true);
  });

  it('@pre_execute should update the object and return response with status code 204', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_remove_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    apiEvent.setData({});
    await softDelete()(apiEvent);
    apiEvent.response.statusCode.should.be.equal(204);
  });

  it('should throw MethodNotAllowedException if not set query or criteria', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.INIT;
    let exception: MethodNotAllowedException;

    try {
      await softDelete()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });

  it('should throw MethodNotAllowedException if not REMOVE operation', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    let exception: MethodNotAllowedException;

    try {
      await softDelete()(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});

