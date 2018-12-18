import {assertToken} from '../../src/index';
import {UnauthorizedException} from '@rxstack/exceptions';
import {Token} from '../mocks/shared/token';

describe('PlatformCallbacks:utils:assert-token', () => {

  it('should pass', async () => {
    const token = new Token();
    assertToken(token);
  });

  it('should throw UnauthorizedException', async () => {
    const data = {};
    let exception: UnauthorizedException;

    try {
      assertToken(null);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });
});
