import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {objectExists, ObjectExistSchema} from '../src';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_task_metadata} from './mocks/validate-unique/app_task.metadata';
import {OBJECT_EXISTS_OPTIONS} from './mocks/object-exits/OBJECT_EXISTS_OPTIONS';
import {UserService} from './mocks/object-exits/user.service';
import {BadRequestException} from '@rxstack/exceptions';
import * as _ from 'lodash';

describe('PlatformCallbacks:object-exists', () => {
  // Setup application
  const app = new Application(OBJECT_EXISTS_OPTIONS);
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

  it('should validate existence in an object', async () => {
    const options: ObjectExistSchema<any> = {
      service: UserService,
      parentField: 'user',
      childField: 'id'
    };

    const request = new Request('HTTP');
    request.body = {
      user: 'u-1'
    };
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await objectExists(options)(apiEvent);
  });

  it('should validate existence in an array of objects', async () => {
    const options: ObjectExistSchema<any> = {
      service: UserService,
      parentField: 'user',
      childField: 'id'
    };

    const request = new Request('HTTP');
    request.body = [
      { user: 'u-1'},
      { user: 'u-2'},
    ];
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await objectExists(options)(apiEvent);
  });

  it('should validate existence in an array of objects with data path option', async () => {
    const options: ObjectExistSchema<any> = {
      service: UserService,
      parentField: 'user',
      childField: 'id',
      dataPath: 'users'
    };

    const request = new Request('HTTP');
    request.body = {
      users: [
        { user: 'u-1'},
        { user: 'u-2'},
      ]
    };
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await objectExists(options)(apiEvent);
  });

  it('should set custom criteria', async () => {
    const options: ObjectExistSchema<any> = {
      service: UserService,
      parentField: 'user',
      childField: 'id',
      criteria: {id: {'$ne': 'u-2'}}
    };

    const request = new Request('HTTP');
    request.body = {
      user: 'u-1'
    };
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await objectExists(options)(apiEvent);
    const criteria = injector.get(UserService).lastCriteria;
    const expected = { id: { '$eq': 'u-1', '$ne': 'u-2' } };
    _.isEqual(criteria, expected).should.be.equal(true);
  });

  it('should throw an exception if object is not found', async () => {
    const options: ObjectExistSchema<any> = {
      service: UserService,
      parentField: 'user',
      childField: 'id'
    };

    const request = new Request('HTTP');
    request.body = {
      user: 'u-3'
    };
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;

    let exception: BadRequestException;

    try {
      await objectExists(options)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });

  it('should throw an exception if data path is not valid', async () => {
    const options: ObjectExistSchema<any> = {
      service: UserService,
      parentField: 'user',
      childField: 'id',
      dataPath: 'unknown'
    };

    const request = new Request('HTTP');
    request.body = { };
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;

    let exception: BadRequestException;
    try {
      await objectExists(options)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });
});
