import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {transform} from '../src';
import {Task} from './mocks/transform/task';
import {app_get_metadata} from './mocks/shared/app.metadata';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);

const data = {
  _id: 'task-1',
  name: 'task-name'
};

describe('PlatformCallbacks:transform', () => {

  it('should transform', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData(data);
    await transform(Task, {groups: ['group_id', 'group_name']})(apiEvent);
    apiEvent.getData()['id'].should.equal('task-1');
    apiEvent.getData()['name'].should.equal('task-name');
  });
});
