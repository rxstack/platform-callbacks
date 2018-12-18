import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {VALIDATE_UNIQUE_OPTIONS} from './mocks/validate-unique/VALIDATE_UNIQUE_OPTIONS';
import {BadRequestException, MethodNotAllowedException} from '@rxstack/exceptions';
import {validateUnique, ValidateUniqueOptions} from '../src';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {data1, data2, data_valid} from './mocks/validate-unique/data';
import {app_task_metadata} from './mocks/validate-unique/app_task.metadata';

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

  it('should throw MethodNotAllowedException on invalid operation', async () => {
    const options: ValidateUniqueOptions = {
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_task_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    let exception: MethodNotAllowedException;

    try {
      await validateUnique(options)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(405);
  });

  it('should throw an exception on missing property', async () => {
    const options: ValidateUniqueOptions = {
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_task_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    let exception: BadRequestException;

    try {
      await validateUnique(options)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
  });

  it('should validate unique property in create mode and throw an exception', async () => {
    const options: ValidateUniqueOptions = {
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_task_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = data1;
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
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_task_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = data_valid;
    await validateUnique(options)(apiEvent);
  });

  it('should validate unique property in update mode and throw an exception', async () => {
    const options: ValidateUniqueOptions = {
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_task_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    apiEvent.setData(data1);
    request.body = data2;
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
      properties: ['id'],
      propertyPath: 'id',
    };

    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_task_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    apiEvent.setData(data1);
    request.body = data1;
    await validateUnique(options)(apiEvent);
  });
});
