import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {
  app_bulk_create_metadata,
  app_create_metadata,
  app_get_metadata,
  app_list_metadata, app_patch_metadata,
  app_remove_metadata, app_update_metadata,
} from './mocks/shared/app.metadata';
import {MethodNotAllowedException, NotFoundException} from '@rxstack/exceptions';
import {softDelete} from '../src/soft-delete';
import * as _ from 'lodash';

describe('PlatformCallbacks:soft-delete', () => {
  // Setup application
  const app = new Application(APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  beforeAll(async() =>  {
    await app.start();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  afterAll(async() =>  {
    await app.stop();
  });

  it('should set delete field on create', async () => {
    const request = new Request('HTTP');
    request.body = {};
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await softDelete({addOnCreate: true})(apiEvent);
    expect(request.body['deletedAt'] === null).toBeTruthy();
  });

  it('should set delete field on bulk create', async () => {
    const request = new Request('HTTP');
    request.body = [{}, {}];
    const apiEvent = new OperationEvent(request, injector, app_bulk_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await softDelete({addOnCreate: true})(apiEvent);
    expect(request.body.length).toBe(2);
    _.forEach(request.body, (v) => expect(v['deletedAt'] === null).toBeTruthy());
  });

  it('should noy set delete field on create', async () => {
    const request = new Request('HTTP');
    request.body = {};
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await softDelete()(apiEvent);
    expect(!!request.body['deletedAt']).toBeFalsy();
  });

  it('should modify the criteria', async () => {
    const request = new Request('HTTP');
    request.attributes.set('criteria', {'id': {'$eq': 1}});
    const apiEvent = new OperationEvent(request, injector, app_patch_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await softDelete()(apiEvent);
    const expected = JSON.parse('{ "id": { "$eq": 1 }, "deletedAt": { "$eq": null } }');
    expect(_.isEqual(request.attributes.get('criteria'), expected)).toBeTruthy();
  });

  it('should modify the query', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_list_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.attributes.set('query', {where: {id: {'$eq': 1}}});
    await softDelete()(apiEvent);

    const expected = JSON.parse('{"where":{"id":{"$eq":1},"deletedAt":{"$eq":null}}}');
    expect(_.isEqual(request.attributes.get('query'), expected)).toBeTruthy();
  });

  it('should successfully validate object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    apiEvent.setData({});
    await softDelete()(apiEvent); // should pass
  });

  it('should validate object and throw an exception', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_update_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    apiEvent.setData({deletedAt: new Date()});
    let exception: NotFoundException;

    try {
      await softDelete()(apiEvent);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(NotFoundException);
  });

  it('should soft delete the object and return response with status code 204', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_remove_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    apiEvent.setData({});
    await softDelete()(apiEvent);
    expect(apiEvent.response.statusCode).toBe(204);
  });

  it('should throw MethodNotAllowedException if not set query or criteria', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_patch_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    let exception: MethodNotAllowedException;

    try {
      await softDelete()(apiEvent);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(MethodNotAllowedException);
  });
});

