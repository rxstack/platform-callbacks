import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {BadRequestException} from '@rxstack/exceptions';
import {dataArray1, dataObj1} from './mocks/shared/data';
import {alterInArray} from '../src/alter-in-array';
import * as _ from 'lodash';

describe('PlatformCallbacks:alter-in-array', () => {
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
    await alterInArray('pick', 'posts', 'name')(apiEvent);
    apiEvent.getData()['posts'].forEach((value: Object) => {
      Object.keys(value).length.should.equal(1);
    });
  });

  it('should keep the given properties in an array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataArray1));
    await alterInArray('pick', 'posts', 'name')(apiEvent);
    apiEvent.getData<Object[]>().forEach(r => {
      r['posts'].forEach((value: Object) => {
        Object.keys(value).length.should.equal(1);
      });
    });
  });

  it('should discard the given properties', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataObj1));
    await alterInArray('omit', 'posts', 'id')(apiEvent);
    apiEvent.getData()['posts'].forEach((value: Object) => {
      Object.keys(value).length.should.equal(1);
    });
  });

  it('should discard the given properties in an array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataArray1));
    await alterInArray('omit', 'posts', 'id')(apiEvent);
    apiEvent.getData<Object[]>().forEach(r => {
      r['posts'].forEach((value: Object) => {
        Object.keys(value).length.should.equal(1);
      });
    });
  });

  it('should throw an exception if given data is not an array', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataArray1));
    let exception: BadRequestException;
    try {
      await alterInArray('pick', 'unknown', 'name')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });
});
