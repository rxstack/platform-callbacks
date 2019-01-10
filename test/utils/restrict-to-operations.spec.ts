import {MethodNotAllowedException} from '@rxstack/exceptions';
import {OperationEventsEnum} from '@rxstack/platform';
import {restrictToOperations} from '../../src/utils';

describe('PlatformCallbacks:utils:restrict-to-pre-operations', () => {
  it('should pass', async () => {
    restrictToOperations('init', [OperationEventsEnum.INIT]);
  });

  it('should throw MethodNotAllowedException', async () => {
    let exception: MethodNotAllowedException;
    try {
      restrictToOperations('init', [OperationEventsEnum.POST_EXECUTE]);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});
