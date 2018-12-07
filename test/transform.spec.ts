import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {APP_OPTIONS} from './mocks/shared/APP_OPTIONS';
import {transform} from '../src';
import {Task} from './mocks/transform/task';
import {BadRequestException} from '@rxstack/exceptions';
import {app_get_metadata} from './mocks/shared/app.metadata';

const data = {
  _id: 'task-1',
  name: 'task-name'
};

describe('PlatformCallbacks:transform', () => {
  // Setup application
  const app = new Application(APP_OPTIONS);
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

  it('should transform', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(data);
    await transform(Task, {groups: ['group_id', 'group_name']})(apiEvent);
    apiEvent.getData()['id'].should.equal('task-1');
    apiEvent.getData()['name'].should.equal('task-name');
  });

  it('should transform with dynamic serialization groups', async () => {
    const request = new Request('HTTP');
    request.attributes.set('serialization_groups', ['group_id']);
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    apiEvent.setData(data);
    await transform(Task)(apiEvent);
    apiEvent.getData()['id'].should.equal('task-1');
    (typeof apiEvent.getData()['name']).should.equal('undefined');
  });

  it('should throw an exception on invalid data', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    let exception: BadRequestException;

    try {
      await transform(Task)(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(400);
  });
});
