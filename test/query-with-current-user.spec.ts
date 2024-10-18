import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_list_metadata, app_patch_metadata} from './mocks/shared/app.metadata';
import {
  BadRequestException,
} from '@rxstack/exceptions';
import {Token} from './mocks/shared/token';
import {queryWithCurrentUser} from '../src';
import * as _ from 'lodash';

const sinon = require('sinon');
const injector = sinon.stub();

describe('PlatformCallbacks:query-with-current-user', () => {

  it('should add userId to the query', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_list_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.attributes.set('query', {where: {id: {'$gt': 1}}});
    await queryWithCurrentUser({idField: 'username'})(apiEvent);
    const expected = JSON.parse('{"where":{"id":{"$gt":1},"userId":{"$eq":"admin"}}}');
    expect(_.isEqual(request.attributes.get('query'), expected)).toBeTruthy();
  });

  it('should add userId to the criteria', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_patch_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    request.attributes.set('criteria', {id: {'$gt': 1}});
    await queryWithCurrentUser({idField: 'username'})(apiEvent);
    const expected = JSON.parse('{"id":{"$gt":1},"userId":{"$eq":"admin"}}');
    expect(_.isEqual(request.attributes.get('criteria'), expected)).toBeTruthy();
  });

  it('should throw BadRequestException if query or criteria are missing', async () => {
    const request = new Request('HTTP');
    request.token = new Token();
    const apiEvent = new OperationEvent(request, injector, app_list_metadata);
    apiEvent.eventType = OperationEventsEnum.PRE_EXECUTE;
    let exception: BadRequestException;
    try {
      await queryWithCurrentUser({idField: 'username'})(apiEvent);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(BadRequestException);
  });
});
