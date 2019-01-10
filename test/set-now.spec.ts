import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {setNow} from '../src/set-now';
import * as _ from 'lodash';

const sinon = require('sinon');
const injector = sinon.createStubInstance(Injector);

describe('PlatformCallbacks:set-now', () => {
  it('should set now on object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData({});

    await setNow('prop_1', 'prop_2')(apiEvent);
    _.isDate(apiEvent.getData()['prop_1']).should.be.equal(true);
    _.isDate(apiEvent.getData()['prop_2']).should.be.equal(true);
  });

  it('should set now on array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData([{}, {}]);
    await setNow('prop_1', 'prop_2')(apiEvent);
    _.forEach(apiEvent.getData(), (v) => {
      _.isDate(v['prop_1']).should.be.equal(true);
      _.isDate(v['prop_2']).should.be.equal(true);
    });
  });
});
