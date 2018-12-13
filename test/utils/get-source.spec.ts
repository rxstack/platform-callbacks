import {getSource} from '../../src/index';
import {
  ApiOperationEvent, OperationEventsEnum,
  OperationTypesEnum
} from '@rxstack/platform';
import {Request} from '@rxstack/core';
import {Injector} from 'injection-js';
import {app_create_metadata} from '../mocks/shared/app.metadata';

const sinon = require('sinon');

describe('PlatformCallbacks:utils:get-source', () => {
  const injector = sinon.createStubInstance(Injector);

  it('should get request.body', async () => {
    const request = new Request('HTTP');
    request.body = {'id': 'test'};
    const event = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    event.eventType = OperationEventsEnum.PRE_WRITE;
    const source = getSource(event);
    JSON.stringify(source).should.be.equal(JSON.stringify(request.body));
  });

  it('should get event.getData', async () => {
    const request = new Request('HTTP');
    const event = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    event.eventType = OperationEventsEnum.POST_WRITE;
    event.setData({'id': 'test'});
    const source = getSource(event);
    JSON.stringify(source).should.be.equal(JSON.stringify(event.getData()));
  });
});
