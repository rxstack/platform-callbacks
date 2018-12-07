import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {setNow} from '../src/set-now';
import * as _ from 'lodash';
import {BadRequestException} from '@rxstack/exceptions';

describe('PlatformCallbacks:set-now', () => {
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

  it('should set now on object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    request.body = {};

    await setNow('prop_1', 'prop_2')(apiEvent);
    _.isDate(request.body['prop_1']).should.be.equal(true);
    _.isDate(request.body['prop_2']).should.be.equal(true);
  });

  it('should set now on array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    request.body = [{}, {}];
    await setNow('prop_1', 'prop_2')(apiEvent);
    _.forEach(request.body, (v) => {
      _.isDate(v['prop_1']).should.be.equal(true);
      _.isDate(v['prop_2']).should.be.equal(true);
    });
  });


  it('should throw an exception is data is not an object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    let exception: BadRequestException;
    try {
      await setNow('prop_1', 'prop_2')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });
});
