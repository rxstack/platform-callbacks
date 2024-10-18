import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {ForbiddenException} from '@rxstack/exceptions';
import {Token} from './mocks/shared/token';
import {restrictToRole} from '../src';

const sinon = require('sinon');
const injector = sinon.stub();

describe('PlatformCallbacks:restrict-to-role', () => {

  it('should pass', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    await restrictToRole('ROLE_ADMIN')(apiEvent); // do nothing
  });

  it('should throw ForbiddenException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    let exception: ForbiddenException;
    try {
      await restrictToRole('ROLE_USER')(apiEvent);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(ForbiddenException);
  });
});
