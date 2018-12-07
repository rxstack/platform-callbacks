import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {app_get_metadata, app_list_metadata} from './mocks/shared/app.metadata';
import {UserService} from './mocks/populate/user.service';
import {POPULATE_OPTIONS} from './mocks/populate/POPULATE_OPTIONS';
import {populate} from '../src/populate';
import * as _ from 'lodash';
import {BadRequestException} from '@rxstack/exceptions';
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

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  after(async() =>  {
    await app.stop();
  });

  it('should populate from object data and string value', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(objData));

    await populate({
      service: UserService,
      parentField: 'user',
      childField: 'id',
    })(apiEvent);

    _.isObject(apiEvent.getData()['user']).should.be.equal(true);
  });

  it('should populate from object data and array value', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(objData));

    await populate({
      service: UserService,
      parentField: 'users',
      childField: 'id',
    })(apiEvent);

    _.forEach(apiEvent.getData()['users'], (v) => _.isObject(v).should.be.equal(true));
  });

  it('should populate from array data and string value', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.POST_COLLECTION_READ;
    apiEvent.setData(_.cloneDeep(arrayData));

    await populate({
      service: UserService,
      parentField: 'user',
      childField: 'id',
    })(apiEvent);

    _.isObject(apiEvent.getData()[0]['user']).should.be.equal(true);
    _.isObject(apiEvent.getData()[1]['user']).should.be.equal(true);
  });


  it('should populate from array data and array value', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.POST_COLLECTION_READ;
    apiEvent.setData(_.cloneDeep(arrayData));

    await populate({
      service: UserService,
      parentField: 'users',
      childField: 'id',
    })(apiEvent);

    _.forEach(apiEvent.getData()[0]['users'], (v) => _.isObject(v).should.be.equal(true));
    apiEvent.getData()[1]['users'].length.should.be.equal(0);
  });

  it('should throw an exception if path is not found', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(objData));
    let exception: BadRequestException;

    try {
      await populate({
        service: UserService,
        parentField: 'unknown',
        childField: 'id',
      })(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });


  it('should populate with a custom property name ', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(objData));

    await populate({
      service: UserService,
      parentField: 'user',
      childField: 'id',
      nameAs: 'renamed'
    })(apiEvent);
    _.isObject(apiEvent.getData()['renamed']).should.be.equal(true);
  });

  it('should populate from a custom method', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(objData));

    await populate({
      service: UserService,
      parentField: 'user',
      childField: 'id',
      method: 'customMethod'
    })(apiEvent);

    _.isObject(apiEvent.getData()['user']).should.be.equal(true);
  });

  it('should populate with custom query', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(_.cloneDeep(objData));
    const q: QueryInterface = {where: {username: {'$eq': 'user-1'}}, limit: 2, skip: 0, sort: { id: -1 } };
    await populate({
      service: UserService,
      parentField: 'users',
      childField: 'id',
      query: q
    })(apiEvent);

    const expectedQuery = '{"where":{"id":{"$in":["u-1","u-2"]},"username":{"$eq":"user-1"}},"limit":2,"skip":0,"sort":{"id":-1}}';
    JSON.stringify(injector.get(UserService).lastQuery).should.be.equal(expectedQuery);
  });

});
