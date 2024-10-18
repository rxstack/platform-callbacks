import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum} from '@rxstack/platform';
import {app_get_metadata} from './mocks/shared/app.metadata';
import {setNow} from '../src/set-now';
import * as _ from 'lodash';

const sinon = require('sinon');
const injector = sinon.stub();

describe('PlatformCallbacks:set-now', () => {
  it('should set now on object', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData({});

    await setNow('prop_1', 'prop_2')(apiEvent);
    expect(_.isDate(apiEvent.getData()['prop_1'])).toBeTruthy();
    expect(_.isDate(apiEvent.getData()['prop_2'])).toBeTruthy();
  });

  it('should set now on array of objects', async () => {
    const request = new Request('HTTP');
    const apiEvent = new OperationEvent(request, injector, app_get_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;
    apiEvent.setData([{}, {}]);
    await setNow('prop_1', 'prop_2')(apiEvent);
    _.forEach<any>(apiEvent.getData(), (v) => {
      expect(_.isDate(v['prop_1'])).toBeTruthy();
      expect(_.isDate(v['prop_2'])).toBeTruthy();
    });
  });
});
