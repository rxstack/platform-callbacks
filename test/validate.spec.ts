import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {BadRequestException, MethodNotAllowedException} from '@rxstack/exceptions';
import {validate} from '../src';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {TaskModel} from './mocks/validate/task.model';
import {taskValidationSchema} from './mocks/validate/task.validation.schema';
import {registerSchema} from 'class-validator';
import {app_create_metadata, app_get_metadata} from './mocks/shared/app.metadata';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);
registerSchema(taskValidationSchema);

describe('PlatformCallbacks:validate', () => {

  it('should validate with errors on object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
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

  it('should validate with errors on array', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.body = [{}, {}, {}];
    let exception: BadRequestException;

    try {
      await validate(TaskModel)(apiEvent);
    } catch (e) {
      exception = e;
    }

    exception.statusCode.should.be.equal(400);
    exception.data.length.should.be.equal(3);
  });


  it('should throw MethodNotAllowedException on invalid operation', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    request.body = { };
    let exception: MethodNotAllowedException;
    try {
      await validate(TaskModel)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(405);
  });

  it('should use validation schema', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
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
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.body = {
      id: 'task-1',
      name: 'task one',
      completed: false
    };
    await validate(TaskModel)(apiEvent);
    request.body.id.should.be.equal('task-1');
  });
});
