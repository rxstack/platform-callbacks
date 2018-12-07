import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {BadRequestException} from '@rxstack/exceptions';
import {validate} from '../src';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {TaskModel} from './mocks/validate/task.model';
import {taskValidationSchema} from './mocks/validate/task.validation.schema';
import {registerSchema} from 'class-validator';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {app_create_metadata} from './mocks/shared/app.metadata';

describe('PlatformCallbacks:validate', () => {
  // Setup application

  const app = new Application(APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;
  before(async() =>  {
    registerSchema(taskValidationSchema);
    await app.start();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  after(async() =>  {
    await app.stop();
  });

  it('should validate with errors', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = { };
    let exception: BadRequestException;

    try {
      await validate(TaskModel)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
    exception.data.length.should.be.equal(3);
  });


  it('should validate with errors and dynamic groups', async () => {
    const request = new Request('HTTP');
    request.attributes.set('validation_groups',  ['group2']);
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = { };
    let exception: BadRequestException;
    try {
      await validate(TaskModel)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
    exception.data.length.should.be.equal(1);
  });

  it('should throw an exception on invalid operation', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    request.body = { };
    let exception: BadRequestException;
    try {
      await validate(TaskModel)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
  });

  it('should use validation schema', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = { };
    let exception: BadRequestException;
    try {
      await validate(taskValidationSchema.name, { groups: ['group1'] })(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
  });

  it('should validate without errors', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = {
      id: 'task-1',
      name: 'task one',
      completed: false
    };
    await validate(TaskModel)(apiEvent);
    request.body.id.should.be.equal('task-1');
  });
});
