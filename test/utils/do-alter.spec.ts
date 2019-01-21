import * as _ from 'lodash';
import {dataArray1, dataObj1} from '../mocks/shared/data';
import {doAlter} from '../../src/index';
import {BadRequestException} from '@rxstack/exceptions';

describe('PlatformCallbacks:utils:do-alter', () => {

  it('should keep properties in object', async () => {
    const data = _.cloneDeep(dataObj1)
    const result = doAlter(data, 'pick', ['name', 'user.fname']);
    Object.keys(result).length.should.equal(2);
    Object.keys(result['user']).length.should.equal(1);
  });

  it('should keep the given properties in an array of objects', async () => {
    const data = _.cloneDeep(dataArray1)
    const result = doAlter(data, 'pick', ['name', 'user.fname']);
    _.forEach(result, v => {
      Object.keys(v).length.should.equal(2);
      Object.keys(v['user']).length.should.equal(1);
    });
  });

  it('should keep properties using property path option', async () => {
    const data = _.cloneDeep(dataObj1)
    const result = doAlter(data, 'pick', ['name'], 'posts');
    _.forEach(result['posts'], v => {
      Object.keys(v).length.should.equal(1);
    });
  });

  it('should discard properties', async () => {
    const data = _.cloneDeep(dataObj1)
    const result = doAlter(data, 'omit', ['name', 'user.fname', 'posts']);
    Object.keys(result).length.should.equal(2);
    Object.keys(result['user']).length.should.equal(1);
  });

  it('should throw exception if property path is not valid', async () => {
    const data = {};
    let exception: BadRequestException;

    try {
      doAlter(data, 'omit', ['name'], 'user');
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
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
    exception.should.be.instanceOf(BadRequestException);
  });
});
