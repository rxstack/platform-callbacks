import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {dataArray1, dataObj1} from './mocks/shared/data';
import {alter} from '../src/alter';
import * as _ from 'lodash';

describe('PlatformCallbacks:alter', () => {
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

  it('should keep the given properties', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataObj1));
    await alter('pick', 'name', 'user.fname')(apiEvent);
    Object.keys(apiEvent.getData()).length.should.equal(2);
    Object.keys(apiEvent.getData()['user']).length.should.equal(1);
  });

  it('should keep the given properties in an array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataArray1));
    await alter('pick', 'name', 'user.fname')(apiEvent);
    apiEvent.getData<Object[]>().forEach(v => {
      Object.keys(v).length.should.equal(2);
      Object.keys(v['user']).length.should.equal(1);
    });
  });

  it('should discard the given properties', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataObj1));
    await alter('omit', 'name', 'user.fname', 'posts')(apiEvent);
    Object.keys(apiEvent.getData()).length.should.equal(2);
    Object.keys(apiEvent.getData()['user']).length.should.equal(1);
  });

  it('should discard the given properties in an array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataArray1));
    await alter('omit', 'name', 'user.fname', 'posts')(apiEvent);
    apiEvent.getData<Object[]>().forEach(v => {
      Object.keys(v).length.should.equal(2);
      Object.keys(v['user']).length.should.equal(1);
    });
  });
});
