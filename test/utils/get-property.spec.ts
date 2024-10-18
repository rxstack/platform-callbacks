import {getProperty} from '../../src/index';
import {BadRequestException} from '@rxstack/exceptions';
import {describe, expect, it} from '@jest/globals';

describe('PlatformCallbacks:utils:get-property', () => {

  it('should get property', async () => {
    const data = {'id': 'test'};
    expect(getProperty(data, 'id')).toBe('test');
  });

  it('should throw BadRequestException', async () => {
    let exception: BadRequestException;
    try {
      getProperty({}, 'unknown');
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(BadRequestException);
  });
});
