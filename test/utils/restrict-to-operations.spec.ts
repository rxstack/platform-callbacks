import {MethodNotAllowedException} from '@rxstack/exceptions';
import {OperationEventsEnum} from '@rxstack/platform';
import {restrictToOperations} from '../../src/utils';

describe('PlatformCallbacks:utils:restrict-to-operations', () => {
  it('should pass', async () => {
    restrictToOperations(OperationEventsEnum.PRE_EXECUTE, [OperationEventsEnum.PRE_EXECUTE]);
  });

  it('should throw MethodNotAllowedException', async () => {
    let exception: MethodNotAllowedException;
    try {
      restrictToOperations(OperationEventsEnum.PRE_EXECUTE, [OperationEventsEnum.POST_EXECUTE]);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });
});
