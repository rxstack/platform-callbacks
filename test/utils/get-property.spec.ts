import {getProperty} from '../../src/index';
import {BadRequestException} from '@rxstack/exceptions';

describe('PlatformCallbacks:utils:get-property', () => {

  it('should get property', async () => {
    const data = {'id': 'test'};
    getProperty(data, 'id').should.be.equal('test');
  });

  it('should throw BadRequestException', async () => {
    let exception: BadRequestException;
    try {
      getProperty({}, 'unknown');
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });
});
