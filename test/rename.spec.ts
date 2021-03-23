import 'reflect-metadata';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {doRename, rename} from '../src';

const sinon = require('sinon');
const injector = sinon.stub();
const request = sinon.stub();

describe('PlatformCallbacks:rename', () => {

  it('should rename a property in object', async () => {
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData({'_id': 1});
    await rename('_id', 'id')(apiEvent);
    const expected = '{"id":1}';
    JSON.stringify(apiEvent.getData()).should.be.equal(expected);
  });

  it('should rename a property in array of objects', async () => {
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData([
      {'_id': 1},
      {'_id': 2},
    ]);
    await rename('_id', 'id')(apiEvent);
    const expected = '[{"id":1},{"id":2}]';
    JSON.stringify(apiEvent.getData()).should.be.equal(expected);
  });

  it('should rename a property in object with propertyPath', async () => {
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData({'user': {
      '_id': 'id'
      }});
    await rename('_id', 'id', 'user')(apiEvent);
    const expected = '{"user":{"id":"id"}}';
    JSON.stringify(apiEvent.getData()).should.be.equal(expected);
  });

  it('should rename a property in array of object with propertyPath', async () => {
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData({'users': [
        { '_id': 1 },
        { '_id': 2 },
    ]});
    await rename('_id', 'id', 'users')(apiEvent);
    const expected = '{"users":[{"id":1},{"id":2}]}';
    JSON.stringify(apiEvent.getData()).should.be.equal(expected);
  });

  it('should rename using doRename', async () => {
    const data = [
      {
        '_id': 1,
        'items': [
          {'_id': 1},
          {'_id': 2},
        ]
      },
      {
        '_id': 1,
        'items': [
          {'_id': 1},
          {'_id': 2},
        ]
      }
    ];

    data.forEach(value => {
      doRename(value, '_id', 'id');
      doRename(value.items, '_id', 'id');
    });
    const expected = '[{"items":[{"id":1},{"id":2}],"id":1},{"items":[{"id":1},{"id":2}],"id":1}]';
    JSON.stringify(data).should.be.equal(expected);
  });
});
