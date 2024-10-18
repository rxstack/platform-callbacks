import {getSource} from '../../src/index';
import {describe, expect, it} from '@jest/globals';
import {
  OperationEvent,
  OperationEventsEnum
} from '@rxstack/platform';
import {Request} from '@rxstack/core';
import {app_create_metadata} from '../mocks/shared/app.metadata';

const sinon = require('sinon');
const injector = sinon.stub();

describe('PlatformCallbacks:utils:get-source', () => {
  it('should get from request.body', async () => {
    const request = new Request('HTTP');
    request.body = {'id': 'test'};
    const event = new OperationEvent(request, injector, app_create_metadata);
    event.eventType = OperationEventsEnum.PRE_EXECUTE;
    const source = getSource(event);
    expect(JSON.stringify(source)).toBe(JSON.stringify(request.body));
  });

  it('should get from event.getData', async () => {
    const request = new Request('HTTP');
    const event = new OperationEvent(request, injector, app_create_metadata);
    event.eventType = OperationEventsEnum.POST_EXECUTE;
    event.setData({'id': 'test'});
    const source = getSource(event);
    expect(JSON.stringify(source)).toBe(JSON.stringify(event.getData()));
  });
});
