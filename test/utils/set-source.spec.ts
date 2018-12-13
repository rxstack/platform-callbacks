import {setSource} from '../../src/index';
import {
  ApiOperationEvent, OperationEventsEnum,
  OperationTypesEnum
} from '@rxstack/platform';
import {Request} from '@rxstack/core';
import {Injector} from 'injection-js';
import {app_create_metadata} from '../mocks/shared/app.metadata';

const sinon = require('sinon');

describe('PlatformCallbacks:utils:set-source', () => {
  const injector = sinon.createStubInstance(Injector);

  it('should get request.body', async () => {
    const request = new Request('HTTP');
    request.body = 'data';
    const event = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    event.eventType = OperationEventsEnum.PRE_WRITE;
    setSource(event, 'new data');
    request.body.should.equal('new data');
  });

  it('should get event.getData', async () => {
    const request = new Request('HTTP');
    const event = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    event.eventType = OperationEventsEnum.POST_WRITE;
    event.setData('data');
    setSource(event, 'new data');
    event.getData().should.equal('new data');
  });
});
