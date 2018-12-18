import 'reflect-metadata';
import {Injector} from 'injection-js';
import { Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {app_create_metadata} from './mocks/shared/app.metadata';
import {MethodNotAllowedException} from '@rxstack/exceptions';
import {Token} from './mocks/shared/token';
import {associateWithCurrentUser} from '../src/associate-with-current-user';
import * as _ from 'lodash';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);

describe('PlatformCallbacks:associate-with-current-user', () => {

  it('should associate with current user on object', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = {};
    await associateWithCurrentUser({idField: 'username'})(apiEvent);
    request.body['userId'].should.be.equal('admin');
  });

  it('should associate with current user on array of objects', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.PRE_WRITE;
    request.body = [{}, {}];
    await associateWithCurrentUser({idField: 'username'})(apiEvent);
    _.forEach(request.body, (item) => item['userId'].should.be.equal('admin'));
  });

  it('should throw MethodNotAllowedException', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_create_metadata, OperationTypesEnum.WRITE);
    apiEvent.eventType = OperationEventsEnum.POST_READ;
    let exception: MethodNotAllowedException;
    try {
      await associateWithCurrentUser({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});
