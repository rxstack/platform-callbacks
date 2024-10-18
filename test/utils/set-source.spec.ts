import {setSource} from '../../src/index';
import {
  OperationEvent,
  OperationEventsEnum
} from '@rxstack/platform';
import {Request} from '@rxstack/core';
import {app_create_metadata} from '../mocks/shared/app.metadata';

const sinon = require('sinon');
const injector = sinon.stub();

describe('PlatformCallbacks:utils:set-source', () => {

  it('should get request.body', async () => {
    const request = new Request('HTTP');
    request.body = 'data';
    const event = new OperationEvent(request, injector, app_create_metadata);
    event.eventType = OperationEventsEnum.PRE_EXECUTE;
    setSource(event, 'new data');
    expect(request.body).toBe('new data');
  });

  it('should set data', async () => {
    const request = new Request('HTTP');
    const event = new OperationEvent(request, injector, app_create_metadata);
    event.eventType = OperationEventsEnum.POST_EXECUTE;
    event.setData('data');
    setSource(event, 'new data');
    expect(event.getData()).toBe('new data');
  });
});
