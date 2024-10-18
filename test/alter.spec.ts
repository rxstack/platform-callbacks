import 'reflect-metadata';
import {describe, expect, it} from '@jest/globals';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {dataArray1, dataObj1} from './mocks/shared/data';
import * as _ from 'lodash';
import {alter} from '../src';

const sinon = require('sinon');
const injector = sinon.stub();

describe('PlatformCallbacks:alter', () => {

  it('should keep properties in an object', async () => {
    const request = new Request('HTTP');
    const event = new OperationEvent(request, injector, app_get_metadata);
    event.eventType = OperationEventsEnum.POST_EXECUTE;
    event.setData(_.cloneDeep(dataObj1));
    await alter('pick', ['name'])(event);
    expect(Object.keys(event.getData()).length).toBe(1);
  });

  it('should keep properties in an array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(dataArray1));
    await alter('pick', ['name', 'user.fname'])(apiEvent);
    apiEvent.getData<Object[]>().forEach((v: any) => {
      expect(Object.keys(v).length).toBe(2);
      expect(Object.keys(v['user']).length).toBe(1);
    });
  });

  it('should discard properties in an object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(dataObj1));
    await alter('omit', ['name', 'user.fname', 'posts'])(apiEvent);
    const data: any = apiEvent.getData();
    expect(Object.keys(apiEvent.getData()).length).toBe(2);
    expect(Object.keys(data['user']).length).toBe(1);
  });
});
