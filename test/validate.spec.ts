import 'reflect-metadata';
import {Request} from '@rxstack/core';
import {BadRequestException} from '@rxstack/exceptions';
import {validate} from '../src';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {TaskModel} from './mocks/validate/task.model';
import {app_create_metadata} from './mocks/shared/app.metadata';

const sinon = require('sinon');
const injector = sinon.stub();

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
    exception.data.errors.length.should.be.equal(3);
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
    exception.data.errors.length.should.be.equal(3);
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
