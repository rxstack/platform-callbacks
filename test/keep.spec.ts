import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {dataArray1, dataObj1} from './mocks/shared/data';
import * as _ from 'lodash';
import {keep} from '../src';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);

describe('PlatformCallbacks:keep', () => {

  it('should keep properties in an object', async () => {
    const request = new Request('HTTP');
    const event = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    event.eventType = OperationEventsEnum.POST_READ;
    event.setData(_.cloneDeep(dataObj1));
    await keep(['name'])(event);
    Object.keys(event.getData()).length.should.equal(1);
  });

  it('should keep properties in an array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(dataArray1));
    await keep(['name', 'user.fname'])(apiEvent);
    apiEvent.getData<Object[]>().forEach(v => {
      Object.keys(v).length.should.equal(2);
      Object.keys(v['user']).length.should.equal(1);
    });
  });

});
