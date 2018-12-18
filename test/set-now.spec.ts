import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {app_get_metadata, app_list_metadata} from './mocks/shared/app.metadata';
import {setNow} from '../src/set-now';
import * as _ from 'lodash';
import {MethodNotAllowedException} from '@rxstack/exceptions';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);

describe('PlatformCallbacks:set-now', () => {
  it('should set now on object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData({});

    await setNow('prop_1', 'prop_2')(apiEvent);
    _.isDate(apiEvent.getData()['prop_1']).should.be.equal(true);
    _.isDate(apiEvent.getData()['prop_2']).should.be.equal(true);
  });

  it('should set now on array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData([{}, {}]);
    await setNow('prop_1', 'prop_2')(apiEvent);
    _.forEach(apiEvent.getData(), (v) => {
      _.isDate(v['prop_1']).should.be.equal(true);
      _.isDate(v['prop_2']).should.be.equal(true);
    });
  });

  it('should throw MethodNotAllowedException on invalid operation', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.QUERY;
    let exception: MethodNotAllowedException;
    try {
      await setNow('prop_1')(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});
