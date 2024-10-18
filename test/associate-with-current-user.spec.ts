import 'reflect-metadata';
import {describe, expect, it} from '@jest/globals';
import { Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_create_metadata} from './mocks/shared/app.metadata';
import {Token} from './mocks/shared/token';
import {associateWithCurrentUser} from '../src/associate-with-current-user';
import * as _ from 'lodash';

const sinon = require('sinon');
const injector = sinon.stub();

describe('PlatformCallbacks:associate-with-current-user', () => {

  it('should associate with current user on object', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.body = {};
    await associateWithCurrentUser({idField: 'username'})(apiEvent);
    expect(request.body['userId']).toBe('admin');
  });

  it('should associate with current user on array of objects', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.body = [{}, {}];
    await associateWithCurrentUser({idField: 'username'})(apiEvent);
    _.forEach(request.body, (item) => expect(item['userId']).toBe('admin'));
  });
});
