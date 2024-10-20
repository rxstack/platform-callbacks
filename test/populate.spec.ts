import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_get_metadata, app_list_metadata} from './mocks/shared/app.metadata';
import {UserService} from './mocks/populate/user.service';
import {POPULATE_OPTIONS} from './mocks/populate/POPULATE_OPTIONS';
import {populate} from '../src/populate';
import * as _ from 'lodash';
import {QueryInterface} from '@rxstack/query-filter';

const objData = {
  user: 'u-1',
  users: ['u-1', 'u-2'],
};

const arrayData = [
  {
    user: 'u-1',
    users: ['u-1', 'u-2']
  },
  {
    user: 'u-2',
    users: ['u-4', 'u-5']
  }
];

describe('PlatformCallbacks:populate', () => {
  // Setup application
  const app = new Application(POPULATE_OPTIONS);
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

  it('should populate from object data and string value', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(objData));

    await populate({
      service: UserService,
      targetField: 'user',
      inverseField: 'id',
    })(apiEvent);
    const data: any = apiEvent.getData();
    expect(_.isObject(data['user'])).toBeTruthy();
  });

  it('should populate from object data and array value', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(objData));

    await populate({
      service: UserService,
      targetField: 'users',
      inverseField: 'id',
    })(apiEvent);
    const data: any = apiEvent.getData();
    _.forEach(data['users'], (v) => expect(_.isObject(v)).toBeTruthy());
  });

  it('should populate from array data and string value', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_list_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(arrayData));

    await populate({
      service: UserService,
      targetField: 'user',
      inverseField: 'id',
    })(apiEvent);
    const data: any = apiEvent.getData();
    expect(_.isObject(data[0]['user'])).toBeTruthy();
    expect(_.isObject(data[1]['user'])).toBeTruthy();
  });


  it('should populate from array data and array value', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_list_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(arrayData));

    await populate({
      service: UserService,
      targetField: 'users',
      inverseField: 'id',
    })(apiEvent);

    const data: any = apiEvent.getData();
    _.forEach(data[0]['users'], (v) => expect(_.isObject(v)).toBeTruthy());
    expect(data[1]['users'].length).toBe(0);
  });

  it('should populate with a custom property name ', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(objData));

    await populate({
      service: UserService,
      targetField: 'user',
      inverseField: 'id',
      nameAs: 'renamed'
    })(apiEvent);

    const data: any = apiEvent.getData();
    expect(_.isObject(data['renamed'])).toBeTruthy();
  });

  it('should populate from a custom method', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(objData));

    await populate({
      service: UserService,
      targetField: 'user',
      inverseField: 'id',
      method: 'customMethod'
    })(apiEvent);
    const data: any = apiEvent.getData();
    expect(_.isObject(data['user'])).toBeTruthy();
  });

  it('should populate with custom query', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(_.cloneDeep(objData));
    const q: QueryInterface = {where: {username: {'$eq': 'user-1'}}, limit: 2, skip: 0, sort: { id: -1 } };
    await populate({
      service: UserService,
      targetField: 'users',
      inverseField: 'id',
      query: q
    })(apiEvent);

    const expectedQuery =
      '{"where":{"id":{"$in":["u-1","u-2"]},"username":{"$eq":"user-1"}},"limit":2,"skip":0,"sort":{"id":-1}}';
    expect(JSON.stringify(injector.get(UserService).lastQuery)).toBe(expectedQuery);
  });
});
