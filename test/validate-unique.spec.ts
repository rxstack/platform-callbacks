import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {VALIDATE_UNIQUE_OPTIONS} from './mocks/validate-unique/VALIDATE_UNIQUE_OPTIONS';
import {BadRequestException} from '@rxstack/exceptions';
import {validateUnique, ValidateUniqueOptions} from '../src';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {data1, data2, data_valid} from './mocks/validate-unique/data';
import {app_task_metadata} from './mocks/validate-unique/app_task.metadata';
import {TaskService} from './mocks/validate-unique/task.service';

describe('PlatformCallbacks:validate-unique', () => {
  // Setup application
  const app = new Application(VALIDATE_UNIQUE_OPTIONS);
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

  it('should validate unique property in create mode and throw an exception', async () => {
    const options: ValidateUniqueOptions = {
      service: TaskService,
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.body = data1;
    let exception: BadRequestException;

    try {
      await validateUnique(options)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
  });

  it('should validate unique property in bulk create mode and throw an exception', async () => {
    const options: ValidateUniqueOptions = {
      service: TaskService,
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.body = [data1];
    let exception: BadRequestException;

    try {
      await validateUnique(options)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
  });

  it('should validate unique property in create mode successfully', async () => {
    const options: ValidateUniqueOptions = {
      service: TaskService,
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.body = data_valid;
    await validateUnique(options)(apiEvent);
  });

  it('should validate unique property in bulk update mode and throw an exception', async () => {
    const options: ValidateUniqueOptions = {
      service: TaskService,
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    apiEvent.setData([data1]);
    request.body = [data2];
    let exception: BadRequestException;

    try {
      await validateUnique(options)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
  });

  it('should validate with one unique property in update mode successfully', async () => {
    const options: ValidateUniqueOptions = {
      service: TaskService,
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_task_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    apiEvent.setData(data1);
    request.body = data1;
    await validateUnique(options)(apiEvent);
  });
});
