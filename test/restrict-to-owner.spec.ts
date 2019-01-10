import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
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
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    apiEvent.setData({
      'userId': 'admin'
    });
    await restrictToOwner({idField: 'username'})(apiEvent); // do nothing
  });

  it('should pass with array data', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_list_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
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
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
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
