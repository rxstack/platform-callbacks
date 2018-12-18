import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {ApiOperationEvent, OperationEventsEnum, OperationTypesEnum} from '@rxstack/platform';
import {app_list_metadata} from './mocks/shared/app.metadata';
import {
  MethodNotAllowedException,
} from '@rxstack/exceptions';
import {Token} from './mocks/shared/token';
import {queryWithCurrentUser} from '../src';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);

describe('PlatformCallbacks:query-with-current-user', () => {

  it('should add userId to the query', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.QUERY;
    request.attributes.set('query', {where: {id: {'$gt': 1}}});
    await queryWithCurrentUser({idField: 'username'})(apiEvent);
    const expected = '{"where":{"id":{"$gt":1},"userId":{"$eq":"admin"}}}';
    JSON.stringify(request.attributes.get('query')).should.be.equal(expected);
  });

  it('should throw MethodNotAllowedException', async () => {
    const request = new Request('HTTP');
    const apiEvent = new ApiOperationEvent(request, injector, app_list_metadata, OperationTypesEnum.LIST);
    apiEvent.eventType = OperationEventsEnum.PRE_COLLECTION_READ;
    let exception: MethodNotAllowedException;
    try {
      await queryWithCurrentUser({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});
