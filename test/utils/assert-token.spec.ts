import {assertToken} from '../../src/index';
import {describe, expect, it} from '@jest/globals';
import {UnauthorizedException} from '@rxstack/exceptions';
import {Token} from '../mocks/shared/token';

describe('PlatformCallbacks:utils:assert-token', () => {

  it('should pass', async () => {
    const token = new Token();
    assertToken(token);
  });

  it('should throw UnauthorizedException', async () => {
    let exception: UnauthorizedException;

    try {
      assertToken(null);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(UnauthorizedException);
  });
});
