import * as _ from 'lodash';
import {describe, expect, it} from '@jest/globals';
import {dataArray1, dataObj1} from '../mocks/shared/data';
import {doAlter} from '../../src/index';
import {BadRequestException} from '@rxstack/exceptions';

describe('PlatformCallbacks:utils:do-alter', () => {

  it('should keep properties in object', async () => {
    const data = _.cloneDeep(dataObj1);
    const result: any = doAlter(data, 'pick', ['name', 'user.fname']);
    expect(Object.keys(result).length).toBe(2);
    expect(Object.keys(result['user']).length).toBe(1);
  });

  it('should keep the given properties in an array of objects', async () => {
    const data = _.cloneDeep(dataArray1);
    const result: any = doAlter(data, 'pick', ['name', 'user.fname']);
    _.forEach(result, v => {
      expect(Object.keys(v).length).toBe(2);
      expect(Object.keys(v['user']).length).toBe(1);
    });
  });

  it('should keep properties using property path option', async () => {
    const data = _.cloneDeep(dataObj1);
    const result: any = doAlter(data, 'pick', ['name'], 'posts');
    _.forEach(result['posts'], v => {
      expect(Object.keys(v).length).toBe(1);
    });
  });

  it('should discard properties', async () => {
    const data = _.cloneDeep(dataObj1);
    const result: any = doAlter(data, 'omit', ['name', 'user.fname', 'posts']);
    expect(Object.keys(result).length).toBe(2);
    expect(Object.keys(result['user']).length).toBe(1);
  });

  it('should throw exception if property path is not valid', async () => {
    const data = {};
    let exception: BadRequestException;

    try {
      doAlter(data, 'omit', ['name'], 'user');
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(BadRequestException);
  });


  it('should throw exception if value is not an object', async () => {
    const data = {
      'user': 'test'
    };
    let exception: BadRequestException;

    try {
      doAlter(data, 'omit', ['name'], 'user');
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(BadRequestException);
  });
});
