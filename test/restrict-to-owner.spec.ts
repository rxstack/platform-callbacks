import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {app_get_metadata, app_list_metadata} from './mocks/shared/app.metadata';
import {
  ForbiddenException
} from '@rxstack/exceptions';
import {restrictToOwner} from '../src/restrict-to-owner';
import {Token} from './mocks/shared/token';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);

describe('PlatformCallbacks:restrict-to-owner', () => {
  it('should pass', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    apiEvent.setData({
      'userId': 'admin'
    });
    await restrictToOwner({idField: 'username'})(apiEvent); // do nothing
  });

  it('should pass with array data', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.PRE_COLLECTION_READ;
    apiEvent.setData([
      {
        'userId': 'admin'
      }
    ]);
    await restrictToOwner({idField: 'username'})(apiEvent); // do nothing
  });

  it('should throw ForbiddenException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_get_metadata, OperationTypesEnum.GET);
    apiEvent.eventType = OperationEventsEnum.PRE_READ;
    apiEvent.setData(undefined);
    let exception: ForbiddenException;
    try {
      await restrictToOwner({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(ForbiddenException);
  });
});
