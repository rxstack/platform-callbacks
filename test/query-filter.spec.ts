import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {queryFilter} from '../src';
import {app_list_metadata} from './mocks/shared/app.metadata';
import {taskQuerySchema} from './mocks/shared/task-query-schema';
import * as _ from 'lodash';
import {MethodNotAllowedException} from '@rxstack/exceptions';

const sinon = require('sinon');
const injector = sinon.stub();

describe('PlatformCallbacks:query-filter', () => {

  it('should create query', async () => {
    const request = new Request('HTTP');
    request.attributes.set('query', {where: {id: {'$eq': 1}}});
    request.params.set('name', 'task');
    request.params.set('completed', 'true');
    request.params.set('unknown', false);
    const event = new OperationEvent(request, injector, app_list_metadata);
    event.eventType = OperationEventsEnum.PRE_EXECUTE;
    await queryFilter(taskQuerySchema)(event);
    const expected = {
      where: {
        id: { '$eq': 1 },
        name: { '$eq': 'task' },
        completed: { '$eq': true }
      },
      limit: 10,
      skip: 0,
      sort: null
    };

    expect(_.isEqual(JSON.stringify(event.request.attributes.get('query')), JSON.stringify(expected))).toBeTruthy();
  });

  it('should throw MethodNotAllowedException if query does not exist.', async () => {
    const request = new Request('HTTP');
    request.params.set('name', 'task');
    request.params.set('completed', 'true');
    request.params.set('unknown', false);
    const event = new OperationEvent(request, injector, app_list_metadata);
    event.eventType = OperationEventsEnum.PRE_EXECUTE;
    let exception: MethodNotAllowedException;
    try {
      await queryFilter(taskQuerySchema)(event);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(MethodNotAllowedException);
  });
});
